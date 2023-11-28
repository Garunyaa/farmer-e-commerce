import express from "express";
import dotenv from "dotenv";
import fileUpload from 'express-fileupload';
import { connectDB } from "./configs/db";
import adminRoutes from "./routes/admin-routes";
import buyerRoutes from "./routes/buyer-routes";
import farmerRoutes from "./routes/farmer-routes";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  createParentPath: true,
}));

const port = process.env.PORT;

connectDB();

app.use("/admin", adminRoutes);
app.use("/buyer", buyerRoutes);
app.use("/farmer", farmerRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
