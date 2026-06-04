export default function SearchFilters() {
  return (
    <div className="filters">

      <h3>Filters</h3>

      <label>Content Type</label>

      <select>
        <option>All Types</option>
        <option>Projects</option>
        <option>People</option>
        <option>Events</option>
      </select>

      <label>Domain</label>

      <select>
        <option>All Domains</option>
      </select>

      <label>Skills</label>

      <div className="skills-list">
        <label><input type="checkbox"/> React</label>
        <label><input type="checkbox"/> Python</label>
        <label><input type="checkbox"/> Node.js</label>
        <label><input type="checkbox"/> Java</label>
        <label><input type="checkbox"/> Machine Learning</label>
      </div>

    </div>
  );
}