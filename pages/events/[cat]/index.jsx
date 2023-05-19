import Link from "next/link";
import Image from "next/image";

export default function EventPage({ data, pageName }) {
  return (
    <div>
      <h1 className="text-2xl">Events in {pageName}</h1>
      {data.map((event, index) => (
        <Link href={`/events/${event.city}/${event.id}`} key={index}>
          <div className="w-[300px] h-[225px] relative">
            <Image alt={event.title} src={event.image} fill style={{ objectFit: "cover" }}></Image>
          </div>
          <h2>{event.title}</h2>
          <p>{event.description}</p>
        </Link>
      ))}
    </div>
  );
}

export async function getStaticPaths() {
  const { events_categories } = await import("/data/data.json");
  const paths = events_categories.map((event) => {
    return {
      params: {
        cat: event.id,
      },
    };
  });
  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { allEvents } = await import("/data/data.json");
  const data = allEvents.filter((event) => event.city === params.cat);
  return {
    props: {
      data: data,
      pageName: params.cat,
    },
  };
}
