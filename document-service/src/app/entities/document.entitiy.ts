import { randomUUID } from 'node:crypto';

export type Category = 'manga' | 'anime' | 'Webtoom';

export type Status = 'read' | 'unread' | 'reading' | 'on_hold' | 'finished';

type DocumentProps = {
  id?: string;
  name: string;
  cap: number;
  nextCap?: number | null | undefined;
  url: string;
  createdAt: Date;

  category: Category;
  recipientId: string;

  status: Status;
};

export class Document {
  constructor(private readonly props: DocumentProps, id?: string) {
    this.props.id = id ? id : randomUUID();
  }

  get id() {
    return this.props.id;
  }

  public set name(name: string) {
    this.props.name = name;
  }

  public get name() {
    return this.props.name;
  }

  public set cap(cap: number) {
    this.props.cap = cap;
  }

  public get cap() {
    return this.props.cap;
  }

  public set nextCap(nextCap: number | null | undefined) {
    this.props.nextCap = nextCap;
  }

  public get nextCap() {
    return this.props.nextCap;
  }

  public set url(url: string) {
    this.props.url = url;
  }

  public get url() {
    return this.props.url;
  }

  public set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public set category(category: Category) {
    this.props.category = category;
  }

  public get category() {
    return this.props.category;
  }

  public set recipientId(recipientId: string) {
    this.props.recipientId = recipientId;
  }

  public get recipientId() {
    return this.props.recipientId;
  }

  public set status(status: Status) {
    this.props.status = status;
  }

  public get status() {
    return this.props.status;
  }
}
