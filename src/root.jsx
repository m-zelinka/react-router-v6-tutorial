import PropTypes from "prop-types";
import { useEffect } from "react";
import {
  Form,
  NavLink,
  Outlet,
  redirect,
  useFetcher,
  useLoaderData,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { useSpinDelay } from "spin-delay";
import LoadingOverlay from "./components/loading-overlay";
import { createContact, getContacts } from "./utils/contacts";

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const contacts = await getContacts(q);

  return { contacts };
}

export async function action() {
  const contact = await createContact();

  return redirect(`/contacts/${contact.id}/edit`);
}

export default function Component() {
  const { contacts } = useLoaderData();

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <SearchBar />
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : undefined
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    <Favorite contact={contact}>
                      <span>★</span>
                    </Favorite>
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail">
        <LoadingOverlay>
          <Outlet />
        </LoadingOverlay>
      </div>
    </>
  );
}

function SearchBar() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  const navigation = useNavigation();
  const searching = new URLSearchParams(navigation.location?.search).has("q");
  const showSpinner = useSpinDelay(searching);

  // Used to submit the form for every keystroke
  const submit = useSubmit();

  // Sync input value with the URL Search Params
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <Form id="search-form" role="search">
      <input
        id="q"
        className={showSpinner ? "loading" : undefined}
        aria-label="Search contacts"
        placeholder="Search"
        type="search"
        name="q"
        defaultValue={q ?? undefined}
        onChange={(event) => {
          const isFirstSearch = q === null;

          submit(event.currentTarget.form, {
            replace: !isFirstSearch,
          });
        }}
      />
      <div id="search-spinner" aria-hidden hidden={!showSpinner} />
    </Form>
  );
}

function Favorite({ contact, children }) {
  const fetcher = useFetcher({ key: `contact:${contact.id}` });
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  if (!favorite) {
    return null;
  }

  return children;
}
Favorite.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.string.isRequired,
    favorite: PropTypes.bool,
  }).isRequired,
  children: PropTypes.node,
};
