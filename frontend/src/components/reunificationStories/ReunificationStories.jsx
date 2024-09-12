import React from "react";
import Slider from "react-slick";
import "./reunificationStories.css";

const reunificationStories = [
  {
    id: 1,
    title: "Max Reunited with Sarah",
    description:
      "Max, a lost Golden Retriever, was reunited with his owner Sarah after being found at a local park.",
    // image: 'path/to/max-image.jpg'
  },
  {
    id: 2,
    title: "Bella Finds Her Way Home",
    description:
      "Bella, a missing Siamese cat, was brought back to her family thanks to a microchip scan.",
    // image: 'path/to/bella-image.jpg'
  },
  {
    id: 3,
    title: "Nogen the shepherd",
    description:
      "Nogen the shepherd was reunited with his family after being found at a local shelter.",
  },
];

const ReunificationStories = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <section className="reunification-slider">
      <h2>Reunification Stories</h2>
      <Slider {...settings}>
        {reunificationStories.map((story) => (
          <div key={story.id} className="slider-item">
            {/* <img src={story.image} alt={story.title} /> */}
            <div className="slider-content">
              <h3>{story.title}</h3>
              <p>{story.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default ReunificationStories;
