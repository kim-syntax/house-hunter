/**
 * Tenant Home/Dashboard Component
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { houseService } from '../../services/houseService';
import type { House } from '../../types';
import styles from './TenantHome.module.css';

export const TenantHome: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetchHouses();
  }, [token, navigate]);

  const fetchHouses = async () => {
    try {
      setLoading(true);
      const response = await houseService.getHouses(1, 20);
      setHouses(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load houses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>🏠 House Hunting</h1>
          <div className={styles.userMenu}>
            <span>Welcome, {user?.firstName}!</span>
            <button className={styles.logoutBtn}>Logout</button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by location, price range..."
          className={styles.searchInput}
        />
        <button className={styles.filterBtn}>🔍 Filter</button>
      </div>

      {/* Featured Listings */}
      <div className={styles.section}>
        <h2>Featured Listings</h2>
        <div className={styles.housesGrid}>
          {loading ? (
            <p>Loading houses...</p>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : houses.length === 0 ? (
            <p>No houses found</p>
          ) : (
            houses.slice(0, 6).map((house) => (
              <div
                key={house.id}
                className={styles.houseCard}
                onClick={() => navigate(`/houses/${house.id}`)}
              >
                {house.photos && house.photos.length > 0 && (
                  <img
                    src={house.photos[0].photoUrl}
                    alt={house.title}
                    className={styles.houseImage}
                  />
                )}
                <div className={styles.houseInfo}>
                  <h3>{house.title}</h3>
                  <p className={styles.location}>
                    📍 {house.estate}, {house.city}
                  </p>
                  <div className={styles.houseMeta}>
                    <span>🛏️ {house.bedrooms} bed</span>
                    <span>🚿 {house.bathrooms} bath</span>
                  </div>
                  <p className={styles.rent}>
                    KES {house.monthlyRent.toLocaleString()}/month
                  </p>
                  <div className={styles.rating}>
                    <span>⭐ {house.averageRating.toFixed(1)}</span>
                    <span>({house.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.bottomNav}>
        <button className={styles.navBtn}>🏠 Home</button>
        <button className={styles.navBtn}>❤️ Saved</button>
        <button className={styles.navBtn}>💬 Messages</button>
        <button className={styles.navBtn}>👤 Profile</button>
      </div>
    </div>
  );
};

export default TenantHome;
