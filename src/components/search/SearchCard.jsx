export default function SearchCard({ data, type }) {

  return (
    <div className="search-card">

      <div className="card-top">

        <div className="avatar">
          {
            type === "user"
              ? data.firstName[0]
              : data.title[0]
          }
        </div>

        <div>

          {
            type === "user"
              ? (
                <h3>
                  {data.firstName} {data.lastName}
                </h3>
              )
              : (
                <h3>{data.title}</h3>
              )
          }

          <span>{type}</span>

        </div>

      </div>

      <p>
        {data.description || data.major}
      </p>

      <div className="tags">

        {data.requiredSkills &&
          data.requiredSkills.map((skill, i) => (
            <span key={i}>{skill}</span>
          ))}

        {data.skills &&
          data.skills.map((skill, i) => (
            <span key={i}>{skill}</span>
          ))}

      </div>

      <button>
        View Details
      </button>

    </div>
  );
}