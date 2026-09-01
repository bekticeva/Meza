export default function Calendar({ availability, onDateSelect }) {

  // date handler
  const today = new Date();

  const dates = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today);

    date.setDate(today.getDate() + index);

    return date;
  });

    function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
    }
  // date handler


  
  return (
    <div className="availability-card">
      <h2>Select a date</h2>

      <select onChange={(e) => {
        onDateSelect(e.target.value);
      }}>
        <option value="">Choose a date</option>

        {dates.map((date) => {
          const dateString = formatDate(date);

          const available = availability.find(
            (item) => item.available_date === dateString,
          );

          return (
            <option
              key={dateString}
              value={dateString}
              disabled={!available || available.remaining_capacity === 0}
            >
              {date.toLocaleDateString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
              {" - "}
              {!available
                ? "Unavailable"
                : available.remaining_capacity === 0
                  ? "Full"
                  : `${available.remaining_capacity} capacity left`}
            </option>
          );
        })}
      </select>
    </div>
  );
}