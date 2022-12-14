import Dataloader from 'dataloader'

import { User } from ".prisma/client";

import{prisma} from "../index"

type BatchUser = (ids: number[]) => Promise<User[]>;
// 通过batch User 把所有相同id的user归类 这样查询的时候所有相同id 的user只要一条查询语句

const batchUsers: BatchUser = async (ids) => {
  console.log(ids);
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  const userMap: { [key: string]: User } = {};

  users.forEach((user) => {
    userMap[user.id] = user;
  });

  return ids.map((id) => userMap[id]);
};

// @ts-ignore
export const userLoader = new Dataloader<number, User>(batchUsers);