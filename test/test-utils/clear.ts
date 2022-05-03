import { DataSource } from "typeorm";

const clearDb =  async(dataSource: DataSource) => {
    await dataSource.dropDatabase()
    await dataSource.synchronize()
}

export {clearDb}