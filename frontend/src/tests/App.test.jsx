import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('App Component', () => {
  it('renders without crashing and displays system title', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Header title & sidebar brand
    expect(screen.getByText(/Police Crime Management System/i)).toBeInTheDocument();
    expect(screen.getByText(/POLICE CMS/i)).toBeInTheDocument();

    // Navigation items
    expect(screen.getByText('Police Stations')).toBeInTheDocument();
    expect(screen.getByText('Officers')).toBeInTheDocument();
    expect(screen.getByText('FIRs')).toBeInTheDocument();
    expect(screen.getByText('Crimes')).toBeInTheDocument();
    expect(screen.getByText('Criminals')).toBeInTheDocument();
    expect(screen.getByText('Victims')).toBeInTheDocument();
    expect(screen.getByText('Cases')).toBeInTheDocument();
    expect(screen.getByText('Evidence')).toBeInTheDocument();
    expect(screen.getByText('Arrests')).toBeInTheDocument();
    expect(screen.getByText('Courts')).toBeInTheDocument();
    expect(screen.getByText('Unified Search')).toBeInTheDocument();
    expect(screen.getByText('About & Status')).toBeInTheDocument();

    // Verify main content renders
    await waitFor(() => {
      expect(screen.getByText(/Crime Analytics & Operations Dashboard/i)).toBeInTheDocument();
    });
  });
});
