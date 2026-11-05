import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getJobCategories, getJobs } from "../services/api.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const serviceWorkExamples = {
  cleaning: { image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=85", alt: "Worker cleaning a home interior", label: "Home and household cleaning" },
  tailoring: { image: "/images/service-work/tailoring.jpg", alt: "Thread and sewing tools ready for garment work", label: "Sewing and clothing repairs" },
  "hair-and-barber": { image: "/images/service-work/hair-braiding.jpg", alt: "Hands braiding hair into neat sections", label: "Hair braiding" },
  carpentry: { image: "/images/service-work/carpentry.jpg", alt: "Woodworker cutting a joint into a board", label: "Woodwork and furniture repair" },
  "beauty-and-nails": { image: "/images/service-work/nail-care.jpg", alt: "Finished decorative nail art", label: "Manicure and nail care" },
  plumbing: { image: "/images/service-work/plumbing.jpg", alt: "Plumbing repair being carried out beneath a sink", label: "Pipe and tap repairs" },
  electrical: { image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=85", alt: "Electrician working on an electrical installation", label: "Electrical installation and repairs" },
  masonry: { image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=85", alt: "Masonry and building work in progress", label: "Building and masonry work" },
  painting: { image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=85", alt: "Painter applying paint to a surface", label: "Painting and decorating" },
  welding: { image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=85", alt: "Welder working with metal", label: "Welding and metalwork" },
  mechanic: { image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=85", alt: "Mechanic inspecting a vehicle", label: "Vehicle maintenance and repair" },
  tutoring: { image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=85", alt: "Tutor helping a student with schoolwork", label: "Tutoring and lessons" },
  childcare: { image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=85", alt: "Child at play during supervised care", label: "Childcare and play" },
  cooking: { image: "/images/service-work/cooking.jpg", alt: "Hands preparing fresh ingredients for a meal", label: "Home cooking" },
  gardening: { image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=85", alt: "Gardener tending plants", label: "Gardening and plant care" },
  delivery: { image: "/images/motorbike-delivery.jpg", alt: "Motorbike ready for local delivery work", label: "Local delivery and errands" },
  farming: { image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=85", alt: "Farm fields ready for cultivation", label: "Farm and field work" },
};

export default function Jobs() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const search = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "";
  const selectedService = categories.find((category) => category.slug === selectedCategory);
  const selectedWorkExample = selectedService && serviceWorkExamples[selectedService.slug];

  useEffect(() => {
    getJobCategories().then(setCategories).catch((err) => setCategoriesError(err.message));
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const timeout = window.setTimeout(() => {
      getJobs({ search, category: selectedCategory })
        .then((listings) => {
          if (active) setJobs(listings);
        })
        .catch((err) => {
          if (active) setError(err.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 200);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [search, selectedCategory]);

  function updateSearch(value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("search", value);
    else next.delete("search");
    setSearchParams(next);
  }

  function updateCategory(category) {
    const next = new URLSearchParams(searchParams);
    if (category) next.set("category", category);
    else next.delete("category");
    setSearchParams(next);
  }

  return (
    <section className="container page-section">
      <div className="page-heading">
        <span className="eyebrow">{t("Skills close to home")}</span>
        <h1>{t("People looking for work")}</h1>
        <p>{t("Browse local skills and services, see what each worker offers, and contact them by phone.")}</p>
      </div>
      <section className="service-directory" aria-labelledby="service-directory-heading">
        <div className="service-directory-heading">
          <div>
            <span className="eyebrow">{t("Find help nearby")}</span>
            <h2 id="service-directory-heading">{t("Browse services people can advertise")}</h2>
            <p>{t("Examples to help workers find the right category. Advert cards below are posted by real local people.")}</p>
          </div>
          {selectedCategory && <button className="text-button" type="button" onClick={() => updateCategory("")}>{t("Show all services")}</button>}
        </div>
        {categoriesError && <p className="error-message" role="alert">Could not load service categories: {categoriesError}</p>}
        <div className="service-directory-grid">
          {categories.map((category) => (
            <button
              className={`service-directory-card${selectedCategory === category.slug ? " service-directory-card-active" : ""}`}
              key={category.slug}
              type="button"
              aria-pressed={selectedCategory === category.slug}
              onClick={() => updateCategory(selectedCategory === category.slug ? "" : category.slug)}
            >
              <strong>{t(category.name)}</strong>
              <span>{t(category.summary)}</span>
              <small>{t("Examples:")} {t(category.examples)}</small>
              <span className="service-directory-link">{t(selectedCategory === category.slug ? "Showing these adverts" : "See local adverts")} →</span>
            </button>
          ))}
        </div>
        {selectedService && !loading && jobs.length === 0 && (
          <aside className="service-example-panel" aria-live="polite">
            {selectedWorkExample && (
              <figure className="service-example-image">
                <img src={selectedWorkExample.image} alt={selectedWorkExample.alt} />
                <figcaption>{t("Sample work")}: {t(selectedWorkExample.label)}</figcaption>
              </figure>
            )}
            <div>
              <span className="eyebrow">{t("Example only — not a real worker advert")}</span>
              <h3>{t("What a service advert could say")}: {t(selectedService.name)}</h3>
              {selectedService.sample_title && <p><strong>{t("Sample title:")}</strong> {t(selectedService.sample_title)}</p>}
              <p><strong>{t("Possible work:")}</strong> {t(selectedService.examples)}</p>
              {selectedService.sample_description && <p>{t(selectedService.sample_description)}</p>}
            </div>
            <Link className="button button-small" to="/register?role=seller">{t("Advertise this service")}</Link>
          </aside>
        )}
      </section>
      <label className="search-field job-search">
        <span className="sr-only">{t("Search people, skills, or work wanted")}</span>
        <span aria-hidden="true">⌕</span>
        <input type="search" value={search} onChange={(event) => updateSearch(event.target.value)} placeholder={t("Search services or skills…")} autoComplete="off" />
      </label>
      <div className="job-results-heading">
        <h2>{selectedCategory ? `${t(categories.find((category) => category.slug === selectedCategory)?.name || "Selected service")} ${t("adverts")}` : t("Local service adverts")}</h2>
        <Link className="button button-small" to="/register?role=seller">{t("Advertise a service")}</Link>
      </div>
      {error ? <p className="error-message" role="alert">Could not load work adverts: {error}</p> : loading ? (
        <div className="empty-state" role="status">{t("Finding local workers…")}</div>
      ) : jobs.length ? (
        <div className="job-grid">
          {jobs.map((job) => (
            <article className="job-card" key={job.id}>
              {job.work_images?.length > 0 && (
                <div className="job-work-gallery" aria-label={`${job.worker_name} ${t("work samples")}`}>
                  {job.work_images.map((image, index) => (
                    <figure key={`${job.id}-${index}`}>
                      <img src={image} alt={`${job.worker_name} ${t(job.worker_is_demo ? "illustrative work example" : "work sample")} ${index + 1}`} loading="lazy" />
                      <figcaption>{t(job.worker_is_demo ? "Illustrative example" : "Work sample")} {index + 1}</figcaption>
                    </figure>
                  ))}
                </div>
              )}
              <div className="worker-identity">
                <div>
                  <span className="eyebrow">{t(categories.find((category) => category.slug === job.category)?.name || "Local service")}</span>
                  <h2>{job.worker_name} — {t(job.title)}</h2>
                  {job.worker_area && <p className="job-worker">{job.worker_area} · {t("Available nearby")}</p>}
                </div>
              </div>
              <div className="job-service-detail"><strong>{t("Services provided")}</strong><p>{t(job.description)}</p></div>
              <p><strong>{t("Skills:")}</strong> {t(job.skills)}</p>
              <div className="job-card-footer">
                <small>{t("Posted")} {new Date(job.created_at).toLocaleDateString()}</small>
              </div>
              {job.worker_phone ? (
                <>
                  <p className="job-contact-number">{t("Contact")} {job.worker_name}: <a href={`tel:${job.worker_phone}`}>{job.worker_phone}</a></p>
                  <div className="job-contact-actions">
                    <a className="button button-small" href={`tel:${job.worker_phone}`}>{t("Call")}</a>
                  </div>
                </>
              ) : <p className="job-contact-unavailable">{t("This worker has not made their phone number public.")}</p>}
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>{t(search || selectedCategory ? "No matching service adverts yet" : "No service adverts yet")}</h2>
          <p>{t(search || selectedCategory ? "Try a different search or service. New local adverts will appear here when they are published." : "Be the first to advertise a service and let nearby customers contact you.")}</p>
          <Link className="button" to="/register?role=seller">{t("Create a seller account to advertise your skills")}</Link>
        </div>
      )}
    </section>
  );
}
