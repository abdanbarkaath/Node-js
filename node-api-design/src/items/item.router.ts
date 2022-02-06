import { Router, Response, Request } from "express"

const router = Router()

const controller = (req: Request, res: Response) => res.send({ message: "hello" })

router.route("/").get(controller).post(controller)

router.route("/:id").put(controller)

export default router
