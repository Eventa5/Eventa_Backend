import type { Request, Response } from "express";
import * as currencyService from "../services/currencyService";

export const getCurrencies = async (req: Request, res: Response) => {
	const currencies = await currencyService.getAllCurrencies();
	res.json({
		status: true,
		message: "Currencies fetched successfully",
		data: currencies,
	});
};

export const createCurrency = async (req: Request, res: Response) => {
	try {
		const { name, code } = req.body;
		// if(!name) return res.status(400).json({ message: 'Currency name is required' });

		const currency = await currencyService.createCurrency({ name, code });
		res.status(201).json({
			status: true,
			message: "Currency created successfully",
			// data: currency,
		});
	} catch (error: any) {
		console.error("Error creating currency:", error);
		res.status(500).json({
			status: false,
			message: "Error creating currency",
		});
	}
};
