import express, { Application, Request, Response } from "express"
import { json, urlencoded } from "body-parser"
import cors from "cors"
import morgan from "morgan"

const app: Application = express()
// app.use(cors)
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan("dev"))

const log = (req: Request, res: Response, next: any) => {
  console.log("middleware")
  next()
}

app.get("/", log, (req: Request, res: Response) => res.send({ message: "hello world" }))
app.get("/data", [log, log, log], (req: Request, res: Response) => res.send({ message: "hello world" }))
app.post("/", (req: Request, res: Response) => res.send({ message: "Post check" }))

export const start = () => {
  app.listen(3000)
}
