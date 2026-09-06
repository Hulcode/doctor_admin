export interface PushSubscriptionJSON {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

let subscriptions: PushSubscriptionJSON[] = []; // demo only — use a real DB

export async function saveSubscription(
  sub: PushSubscriptionJSON,
): Promise<void> {
  subscriptions.push(sub);
}

export async function getAllSubscriptions(): Promise<PushSubscriptionJSON[]> {
  return subscriptions;
}

export async function deleteSubscription(
  sub: PushSubscriptionJSON,
): Promise<void> {
  subscriptions = subscriptions.filter((s) => s.endpoint !== sub.endpoint);
}
