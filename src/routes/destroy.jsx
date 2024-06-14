import { redirect } from "react-router-dom";
import { deleteContact } from "../contacts";

export async function action({ params }) {
  throw new Error("uh oh");
  await deleteContact(params.contactId);

  return redirect("/");
}
