import { Document } from '@app/entities/document.entitiy';
import { faker } from '@faker-js/faker';

type DocumentProps = Document & {
  id?: string;
};

export class MakeDocument {
  static create(props: Partial<DocumentProps> = {}): Document {
    return new Document(
      {
        recipientId: faker.datatype.uuid(),
        name: faker.random.words().toString(),
        category: faker.helpers.arrayElement(['manga', 'anime']),
        cap: faker.datatype.number(),
        createdAt: faker.date.recent(),
        url: faker.internet.url(),
        nextCap: Number(faker.random.numeric()),
        status: 'unread',
        ...props,
      },
      props?.id,
    );
  }
}
