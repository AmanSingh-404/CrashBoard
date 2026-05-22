import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useAuthStore from '../../store/authStore'
import api from '../../api/axiosInstance'

const NAV = [
  { to: '/dashboard',              icon: 'ti-layout-dashboard', label: 'Dashboard'    },
  { to: '/dashboard/errors',       icon: 'ti-alert-triangle',   label: 'All Errors'   },
  { to: '/dashboard/analytics',    icon: 'ti-chart-bar',        label: 'Analytics'    },
  { to: '/dashboard/performance',  icon: 'ti-trending-up',      label: 'Performance'  },
  { to: '/dashboard/team',         icon: 'ti-users',            label: 'Team'         },
  { to: '/dashboard/settings',     icon: 'ti-settings',         label: 'Settings'     },
]

export default function Sidebar() {
  const { user, logout }         = useAuthStore()
  const navigate                 = useNavigate()
  const [projects, setProjects]  = useState([])
  const [active,   setActive]    = useState(0)

  useEffect(() => {
    api.get('/projects').then(r => setProjects(r.data.projects || [])).catch(() => {})
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  const dotColors = ['#e8000d', '#00e05a', '#4d9fff', '#ffaa00', '#c084fc']

  return (
    <div style={{
      width: '220px', flexShrink: 0,
      background: 'var(--color-background-primary)',
      borderRight: '0.5px solid var(--color-border-tertiary)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden',
    }}>

      {/* Logo */}
      <div style={{
        padding: '16px 18px',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '20px', letterSpacing: '.04em',
        color: 'var(--color-text-primary)',
        flexShrink: 0,
      }}>
        CRASH<span style={{ color: '#e8000d' }}>/</span>BOARD
      </div>

      {/* Project switcher */}
      <div style={{
        padding: '12px 18px',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: '10px', color: 'var(--color-text-secondary)',
          letterSpacing: '.06em', textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          Projects
        </div>

        {projects.length === 0 ? (
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            No projects yet
          </div>
        ) : (
          projects.map((p, i) => (
            <div
              key={p._id}
              onClick={() => setActive(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 8px', borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer', marginBottom: '2px',
                background: active === i ? 'var(--color-background-secondary)' : 'transparent',
              }}
            >
              <div style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: dotColors[i % dotColors.length],
                flexShrink: 0,
              }} />
              <span style={{
                fontSize: '12px',
                color: active === i ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                fontWeight: active === i ? 500 : 400,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {p.name}
              </span>
            </div>
          ))
        )}

        <NavLink
          to="/dashboard/settings"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 8px', marginTop: '4px',
            fontSize: '12px', color: 'var(--color-text-secondary)',
            textDecoration: 'none',
          }}
        >
          <i className="ti ti-plus" style={{ fontSize: '13px' }} aria-hidden="true" />
          New project
        </NavLink>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '9px',
              padding: '8px 10px',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '13px',
              color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              background: isActive ? 'var(--color-background-secondary)' : 'transparent',
              fontWeight: isActive ? 500 : 400,
              textDecoration: 'none',
              marginBottom: '2px',
              transition: 'background .15s, color .15s',
            })}
          >
            <i className={`ti ${item.icon}`} style={{ fontSize: '15px' }} aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{
        padding: '10px',
        borderTop: '0.5px solid var(--color-border-tertiary)',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 10px',
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: 'var(--color-background-info)',
            color: 'var(--color-text-info)',
            fontSize: '11px', fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {user?.name?.slice(0, 2).toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-text-secondary)', padding: '4px',
              display: 'flex', alignItems: 'center',
            }}
          >
            <i className="ti ti-logout" style={{ fontSize: '15px' }} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}