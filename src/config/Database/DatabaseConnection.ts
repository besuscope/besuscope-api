import { DataSource } from 'typeorm';

const connectionString = process.env.CONNECTION_STRING;
export const AppDataSource = [
	{
		provide: 'DATA_SOURCE',
		useFactory: async () => {
			const dataSource = new DataSource({
				type: 'postgres',
				url: connectionString,
				entities: [],
			});

			return dataSource.initialize();
		},
	},
];
