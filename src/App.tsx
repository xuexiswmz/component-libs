import "./App.css";
import Watermark from "./Watermark";

export default function App() {
  return (
    <Watermark
      content={["xuexiswmz", "Watermark Component"]}
      gap={[0, 0]}
      offset={[0, 0]}
      fontStyle={{
        color: "skyblue",
      }}
    >
      <div style={{ height: 800 }}>
        <p>Earum temporibus amet cumque autem quo quia molestiae.</p>
        <p>
          Asperiores sint molestiae laboriosam illum ullam omnis error dolorem.
          Velit laborum molestiae. Sint commodi enim quia magni nemo architecto
          assumenda. Assumenda et aliquam asperiores veniam est quas non
          voluptatem. Est velit aspernatur officiis voluptatem ad quod. Porro
          dolore minima voluptatem eos. Ab accusantium in magni sunt. Dolor ut
          atque voluptatem. Ex ut est ullam et porro sit rerum labore inventore.
          Mollitia adipisci totam voluptatem. Repudiandae doloribus est sit
          minima ducimus nihil sunt repudiandae. Tenetur et sint ut quaerat
          reiciendis voluptate ipsum aut nemo. Dignissimos nobis ut. Aut
          blanditiis tenetur minima amet aspernatur. Modi nulla corrupti ipsum
          molestiae fugiat et. Ipsam quibusdam beatae dolores illo eius optio ut
          laborum.
        </p>
        <p>
          Qui non nobis officiis esse reprehenderit reiciendis accusantium. Quis
          perferendis ut illum esse ut debitis aliquid. Dolorem ut rerum
          explicabo.
        </p>
      </div>
    </Watermark>
  );
}
