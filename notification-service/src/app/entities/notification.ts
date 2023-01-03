import { randomUUID } from 'node:crypto';

export type NotificationProps = {
  recipient_id: string;
  read_at: Date | null | undefined;

  content: string;
};

export class Notification {
  private readonly _id: string;

  constructor(private readonly props: NotificationProps) {
    this._id = randomUUID();
  }

  get recipient_id(): string {
    return this.props.recipient_id;
  }

  get read_at(): Date | null | undefined {
    return this.props.read_at;
  }
  set read_at(updated_at: Date | null | undefined) {
    this.props.read_at = updated_at;
  }

  get content(): string {
    return this.props.content;
  }

  get id(): string {
    return this._id;
  }
}
