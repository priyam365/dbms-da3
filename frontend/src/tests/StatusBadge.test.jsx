import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge, { getStatusColorClass } from '../components/StatusBadge';

describe('StatusBadge Component', () => {
  it('renders correct color class for each status', () => {
    expect(getStatusColorClass('Open')).toBe('badge-blue');
    expect(getStatusColorClass('Under Investigation')).toBe('badge-amber');
    expect(getStatusColorClass('Closed')).toBe('badge-gray');
    expect(getStatusColorClass('Referred to Court')).toBe('badge-purple');
    expect(getStatusColorClass('Critical')).toBe('badge-red');
    expect(getStatusColorClass('High')).toBe('badge-orange');
    expect(getStatusColorClass('Medium')).toBe('badge-yellow');
    expect(getStatusColorClass('Low')).toBe('badge-green');
    expect(getStatusColorClass('Pending')).toBe('badge-gray');
    expect(getStatusColorClass('In Custody')).toBe('badge-red');
    expect(getStatusColorClass('Released on Bail')).toBe('badge-yellow');
    expect(getStatusColorClass('Produced in Court')).toBe('badge-purple');
    expect(getStatusColorClass('Arrested')).toBe('badge-red');
  });

  it('renders the status badge element with label text', () => {
    render(<StatusBadge status="Under Investigation" />);
    const badge = screen.getByTestId('status-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Under Investigation');
    expect(badge).toHaveClass('badge-amber');
  });

  it('renders nothing when status is null or undefined', () => {
    const { container } = render(<StatusBadge status={null} />);
    expect(container.firstChild).toBeNull();
  });
});
