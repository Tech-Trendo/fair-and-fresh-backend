export function ServiceAreaMap() {
  const googleMapEmbedUrl =
    "https://maps.google.com/maps?q=Fair%20and%20Fresh%20Cleaning%20Brisbane&t=m&z=9&output=embed&iwloc=near";

  return (
    <section id="service-areas">
      <iframe
        src={googleMapEmbedUrl}
        title="Fair and Fresh Cleaning Brisbane Google Map"
        loading="lazy"
        width="100%"
        height="500"
        style={{ border: 0, display: "block" }}
        allowFullScreen
      />
    </section>
  );
}