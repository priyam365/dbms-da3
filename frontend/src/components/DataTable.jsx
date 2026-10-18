import React, { useState, useMemo } from 'react';
import { Search, Eye, Edit2, Trash2, Inbox } from 'lucide-react';

export function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No records found',
  emptySubMessage = 'Try adjusting your search criteria or add a new record to get started.',
  onView,
  onEdit,
  onDelete,
  idField = 'id',
  searchable = true,
  searchPlaceholder = 'Filter records...',
  customActions,
  headerAction,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();

    return data.filter((row) =>
      columns.some((col) => {
        const val = col.accessor ? (typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]) : row[col.key];
        return String(val ?? '').toLowerCase().includes(term);
      })
    );
  }, [data, columns, searchTerm]);

  const hasActions = Boolean(onView || onEdit || onDelete || customActions);

  return (
    <div className="table-container" data-testid="data-table">
      {(searchable || headerAction) && (
        <div className="table-toolbar">
          {searchable ? (
            <div className="table-search-input-wrapper">
              <Search size={16} className="table-search-icon" />
              <input
                type="text"
                className="table-search-input"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          ) : (
            <div />
          )}

          {headerAction && <div className="table-header-action">{headerAction}</div>}
        </div>
      )}

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  style={{ width: col.width || 'auto', textAlign: col.align || 'left' }}
                >
                  {col.header}
                </th>
              ))}
              {hasActions && <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Loading Skeleton Rows
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={`skeleton-${rIdx}`}>
                  {columns.map((col, cIdx) => (
                    <td key={`skeleton-col-${cIdx}`}>
                      <div
                        className="skeleton"
                        style={{ height: '18px', width: '80%', minWidth: '60px' }}
                      />
                    </td>
                  ))}
                  {hasActions && (
                    <td style={{ textAlign: 'center' }}>
                      <div
                        className="skeleton"
                        style={{ height: '24px', width: '60px', margin: '0 auto' }}
                      />
                    </td>
                  )}
                </tr>
              ))
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (hasActions ? 1 : 0)}>
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <Inbox size={28} />
                    </div>
                    <div className="empty-state-title">{emptyMessage}</div>
                    <div className="empty-state-desc">{emptySubMessage}</div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((row, rIdx) => {
                const rowKey = row[idField] || row._id || rIdx;

                return (
                  <tr key={rowKey}>
                    {columns.map((col, cIdx) => {
                      const value = col.accessor
                        ? typeof col.accessor === 'function'
                          ? col.accessor(row)
                          : row[col.accessor]
                        : row[col.key];

                      return (
                        <td
                          key={col.key || cIdx}
                          style={{ textAlign: col.align || 'left' }}
                        >
                          {col.render ? col.render(value, row) : value ?? '—'}
                        </td>
                      );
                    })}

                    {hasActions && (
                      <td>
                        <div className="table-actions" style={{ justifyContent: 'center' }}>
                          {onView && (
                            <button
                              type="button"
                              className="btn btn-ghost btn-icon-only"
                              title="View Details"
                              onClick={() => onView(row)}
                            >
                              <Eye size={16} />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              type="button"
                              className="btn btn-ghost btn-icon-only"
                              title="Edit Record"
                              onClick={() => onEdit(row)}
                            >
                              <Edit2 size={15} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              className="btn btn-ghost btn-icon-only"
                              title="Delete Record"
                              style={{ color: '#ef4444' }}
                              onClick={() => onDelete(row)}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                          {customActions && customActions(row)}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredData.length > 0 && (
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>
            Showing {filteredData.length} of {data.length} records
          </span>
          {searchTerm && (
            <span>
              Filtered by: <em>&ldquo;{searchTerm}&rdquo;</em>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default DataTable;
