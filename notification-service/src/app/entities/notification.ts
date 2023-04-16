import { ObjectId } from 'bson';

export type NotificationProps = {
  recipient_id: string;
  read_at: Date | null | undefined;
  content: string;
  created_at?: Date;
};

export class Notification {
  private readonly _id: string;

  constructor(private readonly props: NotificationProps, id?: string) {
    this._id = id || new ObjectId().toString('hex');
    if (!this.props.created_at) {
      this.props.created_at = new Date();
    }
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

  get created_at(): Date {
    return this.props?.created_at;
  }
}
