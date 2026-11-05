export default function DataTable({ columns, rows, emptyMessage = "No records to show." }) {
  if (!rows.length) return <p className="admin-empty">{emptyMessage}</p>;
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => (
          <tr key={row.id ?? row.month ?? row.product_id ?? index}>
            {columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
