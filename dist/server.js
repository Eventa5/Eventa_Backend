var __importDefault =
	(this && this.__importDefault) ||
	((mod) => (mod && mod.__esModule ? mod : { default: mod }));
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 3000;
app.get("/", (req, res) => {
	res.send("Hi world!");
});
app.listen(PORT, () => {
	console.log(`Server is running at http://127.0.0.1:${PORT}`);
});
