use crate::service::book_services;
use actix_web::Error;
use cron::Schedule;
use futures::future;
use rand::Rng;
use std::{str::FromStr, sync::Arc};
use tokio::{
    sync::Semaphore,
    time::{sleep_until, Duration, Instant},
};
async fn push_sf_book_new_data(bid: i32) -> Result<(), Error> {
    const MAX_RETRIES: u32 = 5;
    let book = {
        let mut retries = 0;
        loop {
            match book_services::BookServices::find_sf_book(bid).await {
                Ok(book) => break book,
                Err(e) => {
                    retries += 1;
                    if retries >= MAX_RETRIES {
                        log::error!("爬取书本 {} 失败，已重试 {} 次: {:?}", bid, retries, e);
                        return Err(e);
                    }
                    // 指数退避：base 5s，每次翻倍，最大 60s，加随机抖动
                    let backoff = std::cmp::min(5 * 2u64.pow(retries - 1), 60);
                    let jitter = rand::thread_rng().gen_range(0..3);
                    log::warn!("爬取书本 {} 第 {} 次重试，等待 {}s", bid, retries, backoff + jitter);
                    tokio::time::sleep(Duration::from_secs(backoff + jitter)).await;
                }
            }
        }
    };
    let mut retries = 0;
    loop {
        match book_services::BookServices::insert_sf_book(book.clone()).await {
            Ok(_) => break,
            Err(e) => {
                retries += 1;
                if retries >= MAX_RETRIES {
                    log::error!("插入书本 {} 失败，已重试 {} 次: {:?}", bid, retries, e);
                    return Err(e);
                }
                let backoff = std::cmp::min(5 * 2u64.pow(retries - 1), 60);
                let jitter = rand::thread_rng().gen_range(0..3);
                tokio::time::sleep(Duration::from_secs(backoff + jitter)).await;
            }
        }
    }

    Ok(())
}
async fn async_fn() -> Result<(), actix_web::Error> {
    let bids = book_services::BookServices::find_sf_all_bid().await?;
    let mut tasks = Vec::new();
    // 使用信号量来控制并发数，降低并发避免被反爬封禁
    let semaphore = Arc::new(Semaphore::new(5));
    for id in bids {
        // 克隆Arc以共享Semaphore
        let semaphore_clone = semaphore.clone();
        tasks.push(async move {
            // 获取许可，如果Semaphore中没有可用的许可，这里会等待直到有许可可用
            let permit = semaphore_clone.acquire_owned().await.unwrap();
            // 执行耗费资源的异步任务
            let res = push_sf_book_new_data(id).await;
            // 任务完成后短暂延迟，控制整体请求频率
            let delay = rand::thread_rng().gen_range(500..=1500);
            tokio::time::sleep(Duration::from_millis(delay)).await;
            // 显式释放许可，让其他等待的任务可以获取许可
            drop(permit);
            res
        })
    }
    future::join_all(tasks).await;
    Ok(())
}

use chrono::Local; // Import Local for local time

pub async fn schedule_task() {
    // 定义一个 cron 表达式，例如每天的 14:30
    let cron_expr = "00 01 00 * * *"; // 秒 分 时 日 月 星期

    // 解析 cron 表达式
    let schedule = Schedule::from_str(cron_expr).unwrap();

    loop {
        // 获取下一个运行时间
        let now = Local::now(); // Use local time instead of Utc
        let upcoming = schedule.upcoming(Local).take(1).next().unwrap(); // Use Local for upcoming time
                                                                         // 计算需要等待的时间
        let duration = upcoming.signed_duration_since(now).to_std().unwrap();

        // 等待直到下一个运行时间
        sleep_until(Instant::now() + Duration::from_secs(duration.as_secs())).await;

        // 执行任务
        println!("book爬虫维护任务开始执行: {}", Local::now()); // Use local time for task execution time

        // 任务函数
        let _ = async_fn().await;
        println!("book爬虫维护定时任务执行完成: {}", Local::now())
    }
}
