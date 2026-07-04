import { WaitListTimeLine } from "./timeLine";

export interface Stats {
    waitlist_member: number,
    wallets_connected: number,
    escrows_completed:number,
    escrow_created:number,
    avg_monthly_completed_escrow:number,
    avg_transactions_per_user: number,
    waitlist_timeline: WaitListTimeLine[],
}