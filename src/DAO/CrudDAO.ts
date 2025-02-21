import {EntityData, ORM} from "../Data/Types";
import { OrmError } from "../OrmError";
import {PrismaClient, Prisma} from "@prisma/client"
import {DefaultArgs} from "@prisma/client/runtime/client"

export type CrudMethods<T> = {
    create: (data: { data: T }) => Promise<T>
    // update: (data: { where: { id: number }; data: Partial<T> }) => Promise<T>
    // findUnique: (data: { where: { id: number } }) => Promise<T | null>
    // delete: (data: { where: { id: number } }) => Promise<void>
    // findMany: (data?: { where?: number }) => Promise<T[]>
};

export interface ORM2 {
    user: Prisma.UserDelegate<DefaultArgs, Prisma.PrismaClientOptions>
    task: Prisma.TaskDelegate<DefaultArgs, Prisma.PrismaClientOptions>
    project: Prisma.ProjectDelegate<DefaultArgs, Prisma.PrismaClientOptions>
}

export class CrudDAO<T extends EntityData> {
    private readonly orm: ORM2
    private readonly model: keyof ORM2

    constructor(orm: ORM2, model: keyof ORM2) {
        this.orm = orm
        this.model = model
    }

    private getModel(): CrudMethods<T> {
        return this.orm[this.model] as unknown as CrudMethods<T>;
    }

    // TODO: продожить

    async create(data: Partial<T>): Promise<T> {
        try {
            return await this.getModel().create({
                data: data as T
            });
        } catch (error) {
            throw new OrmError(error);
        }
    }
/*
    async update(id: number, data: Partial<T>): Promise<T> {
        try {
            return await this.orm[this.model].update({
                where: { id },
                data: data as T
            });
        } catch (error) {
            throw new OrmError(error);
        }
    }

    async getById(id: number): Promise<T | null> {
        try {
            return await this.orm[this.model].findUnique({
                where: { id }
            });
        } catch (error) {
            throw new OrmError(error);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.orm[this.model].delete({
                where: { id }
            });
        } catch (error) {
            throw new OrmError(error);
        }
    }

    async getAll(): Promise<T[]> {
        try {
            return await this.orm[this.model].findMany();
        } catch (error) {
            throw new OrmError(error);
        }
    }

    async findMany(where?: any): Promise<T[]> {
        try {
            return await this.orm[this.model].findMany({ where });
        } catch (error) {
            throw new OrmError(error);
        }
    }*/
}
