import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

describe('Dashboard Component', () => {
  it('renders stats cards and recent cases table', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Check header
    expect(screen.getByText(/Crime Analytics & Operations Dashboard/i)).toBeInTheDocument();

    // Check stats cards
    await waitFor(() => {
      expect(screen.getByText(/Total Cases/i)).toBeInTheDocument();
      expect(screen.getByText(/Open Cases/i)).toBeInTheDocument();
      expect(screen.getByText(/Arrests Made/i)).toBeInTheDocument();
      expect(screen.getByText(/Evidence Items/i)).toBeInTheDocument();
      expect(screen.getByText(/FIRs Filed/i)).toBeInTheDocument();
      expect(screen.getByText(/Active Officers/i)).toBeInTheDocument();
    });

    // Check recent cases section
    expect(screen.getByText(/Recent Investigation Cases/i)).toBeInTheDocument();
    expect(screen.getByText(/Quick Access Management Modules/i)).toBeInTheDocument();
  });
});
