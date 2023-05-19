import Link from "next/link";
import Image from "next/image";
import Container from "@mui/material/Container";

export default function EventsPage({ data }) {
  return (
    <Container maxWidth="xl" className="mt-8">
      <div className="flex gap-6 flex-wrap">
        {data.map((category, index) => {
          return (
            <div key={index} className="flex flex-col gap-4">
              <Link href={`/events/${category.id}`}>
                <div className="w-[300px] h-[225px] relative">
                  <Image alt={category.title} src={category.image} fill style={{ objectFit: "cover" }}></Image>{" "}
                </div>
                <h2 className="text-xl font-bold text-center">{category.title}</h2>
              </Link>
            </div>
          );
        })}
      </div>
    </Container>
  );
}

export async function getServerSideProps() {
  const { events_categories } = await import("/data/data.json");
  return {
    props: {
      data: events_categories,
    },
  };
}
