import {
  json,
  useRouteLoaderData,
  redirect,
  defer,
  Await,
} from "react-router-dom";
import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";
import { Suspense } from "react";
import { getAuthToken } from "../util/auth";

export default function EventDetailPage() {
  const { event, events } = useRouteLoaderData("event-detail");
  return (
    <>
      <Suspense fallback={<p style={{ textAlign: "center" }}>로딩중...</p>}>
        <Await resolve={event}>
          {(loadedevent) => <EventItem event={loadedevent} />}
        </Await>
      </Suspense>
      <Suspense fallback={<p style={{ textAlign: "center" }}>로딩중...</p>}>
        <Await resolve={events}>
          {(loadedEvents) => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </>
  );
}

async function loadEvent(id) {
  const response = await fetch(
    `https://react-http-20885-default-rtdb.asia-southeast1.firebasedatabase.app/20-react-router-spa-2/events/${id}.json`
  );

  if (!response.ok) {
    throw json(
      { message: "선택된 이벤트의 세부정보를 가져올 수 없습니다." },
      { status: 500 }
    );
  } else {
    const resData = await response.json();
    return resData.event;
  }
}

async function loadEvents() {
  const response = await fetch(
    "https://react-http-20885-default-rtdb.asia-southeast1.firebasedatabase.app/20-react-router-spa-2/events.json"
  );
  if (!response.ok) {
    return json(
      { message: "이벤트를 가져올 수 없습니다." },
      {
        status: 500,
      }
    );
  } else {
    const resData = await response.json();
    return resData.events;
  }
}

export async function loader({ request, params }) {
  const id = params.eventId;
  return defer({
    event: await loadEvent(id),
    events: loadEvents(),
  });
}

export async function action({ params, request }) {
  const eventId = params.eventId;
  const token = getAuthToken();
  const response = await fetch(
    `https://react-http-20885-default-rtdb.asia-southeast1.firebasedatabase.app/20-react-router-spa-2/events/${eventId}.json`,
    {
      method: request.method,
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  if (!response.ok) {
    throw json({ message: "이벤트를 삭제할 수 없습니다." }, { status: 500 });
  }

  return redirect("/events");
}
