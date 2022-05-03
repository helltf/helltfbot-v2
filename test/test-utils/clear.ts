import { DataSource } from "typeorm";

const clearDb =  async(dataSource: DataSource) => {
    console.log('cleared db')
    await dataSource.dropDatabase()
    await dataSource.synchronize()
    console.log('cleared db')
}

export {clearDb}