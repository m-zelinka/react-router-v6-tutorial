import PropTypes from "prop-types";
import { Form, useFetcher, useLoaderData } from "react-router-dom";
import { getContact, updateContact } from "../utils/contacts";

export async function loader({ params }) {
  const contact = await getContact(params.contactId);

  if (!contact) {
    throw new Response("", { status: 404, statusText: "Not Found" });
  }

  return { contact };
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const favorite = formData.get("favorite");

  await updateContact(params.contactId, {
    favorite: favorite === "true",
  });

  return { ok: true };
}

export default function Component() {
  const { contact } = useLoaderData();

  return (
    <div id="contact">
      <img
        key={contact.avatar}
        src={
          contact.avatar ||
          `https://robohash.org/${contact.id}.png?size=200x200`
        }
        alt=""
      />
      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>
        {contact.twitter ? (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        ) : null}
        {contact.notes ? <p>{contact.notes}</p> : null}
        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              const shouldDelete = confirm(
                "Please confirm you want to delete this record.",
              );

              if (!shouldDelete) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }) {
  const fetcher = useFetcher({ key: `contact:${contact.id}` });
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
Favorite.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.string.isRequired,
    favorite: PropTypes.bool,
  }).isRequired,
};
