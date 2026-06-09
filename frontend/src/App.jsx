import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const HUB_COORDINATES = {
  "Prayagraj Junction": [25.4497, 81.8294],
  "Triveni Sangam (Confluence Zone)": [25.4284, 81.8864],
  "Kumbh Mela Ground (Main Venue)": [25.4375, 81.8610],
  "Dashashwamedh Ghat (Prayagraj)": [25.4310, 81.8685],
  "Shri Bade Hanuman Temple": [25.4302, 81.8770],
  "Saraswati Ghat": [25.4244, 81.8540],
  "Alopankari Temple Area": [25.4542, 81.8664]
};

function ChangeMapView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

function App() {
  const [origin, setOrigin] = useState('Prayagraj Junction');
  const [destination, setDestination] = useState('Kumbh Mela Ground (Main Venue)');
  const [temperature, setTemperature] = useState(31);
  const [hour, setHour] = useState(16);
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ connected: null, checking: true });

  const BACKEND_URL = 'http://127.0.0.1:8000';
  const hubs = Object.keys(HUB_COORDINATES);

  useEffect(() => {
    axios.get(BACKEND_URL)
      .then(() => setBackendStatus({ connected: true, checking: false }))
      .catch(() => setBackendStatus({ connected: false, checking: false }));
  }, []);

  const executePipeline = async (e) => {
    e.preventDefault();
    if (origin === destination) return alert("Origin and Destination cannot be identical.");
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/analyze`, {
        params: { origin, destination, temperature, hour }
      });
      setData(response.data);
    } catch (err) {
      console.error("API Integration Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Upgraded Dark Mode Color Theme
  const getTheme = (severity) => {
    switch(severity) {
      case 'CRITICAL': return { color: '#fca5a5', bg: '#7f1d1d', border: '#b91c1c', mapColor: '#ef4444' };
      case 'HIGH': return { color: '#fdba74', bg: '#7c2d12', border: '#c2410c', mapColor: '#f97316' };
      case 'MEDIUM': return { color: '#fde047', bg: '#713f12', border: '#a16207', mapColor: '#eab308' };
      default: return { color: '#86efac', bg: '#14532d', border: '#15803d', mapColor: '#22c55e' };
    }
  };

  const getRoutePolyline = () => {
    if (!data) return [];
    const points = [HUB_COORDINATES[origin]];
    if (data.routing.is_diverted) {
      if (data.metrics.severity === 'CRITICAL') points.push([25.4600, 81.8500]);
      else points.push([25.4200, 81.8700]);
    }
    points.push(HUB_COORDINATES[destination]);
    return points;
  };

  const currentMapCenter = data ? HUB_COORDINATES[data.metrics.location] : [25.4358, 81.8463];

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#020617', minHeight: '100vh', padding: '2rem 1rem', position: 'relative', overflow: 'hidden', color: '#e2e8f0' }}>
      
      {/* BACKGROUND WATERMARK */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '10vw', fontWeight: '900', color: 'rgba(255, 255, 255, 0.02)', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 0, letterSpacing: '0.1em' }}>
        PRAYAGRAJ 2026
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', padding: '2.5rem', position: 'relative', zIndex: 1 }}>
        
        {/* CENTERED HEADER */}
        <header style={{ borderBottom: '1px solid #334155', paddingBottom: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ margin: 0, color: '#f8fafc', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '1px' }}>CROWDSENSE AI</h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#94a3b8', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Strategic Infrastructure & Operations Command</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: backendStatus.connected ? 'rgba(20, 83, 45, 0.5)' : 'rgba(127, 29, 29, 0.5)', padding: '0.5rem 1.2rem', borderRadius: '9999px', border: backendStatus.connected ? '1px solid #15803d' : '1px solid #b91c1c' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: backendStatus.connected ? '#4ade80' : '#f87171', display: 'inline-block', boxShadow: backendStatus.connected ? '0 0 10px #4ade80' : '0 0 10px #f87171' }}></span>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: backendStatus.connected ? '#4ade80' : '#f87171', textTransform: 'uppercase' }}>
              {backendStatus.checking ? 'Pinging Core...' : backendStatus.connected ? 'AI Core Online' : 'Core Disconnected'}
            </span>
          </div>
        </header>

        {/* ALIGNED 4-COLUMN INPUT FORM */}
        <form onSubmit={executePipeline} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', width: '100%' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '10px', border: '1px solid #334155' }}>
              <label style={{ display: 'block', fontWeight: '700', color: '#94a3b8', marginBottom: '0.75rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Source Node</label>
              <select value={origin} onChange={(e) => setOrigin(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #475569', fontSize: '0.95rem', backgroundColor: '#0f172a', color: '#f8fafc', outline: 'none' }}>
                {hubs.map(h => <option key={`orig-${h}`} value={h}>{h}</option>)}
              </select>
            </div>
            <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '10px', border: '1px solid #334155' }}>
              <label style={{ display: 'block', fontWeight: '700', color: '#94a3b8', marginBottom: '0.75rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Destination Target</label>
              <select value={destination} onChange={(e) => setDestination(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #475569', fontSize: '0.95rem', backgroundColor: '#0f172a', color: '#f8fafc', outline: 'none' }}>
                {hubs.map(h => <option key={`dest-${h}`} value={h}>{h}</option>)}
              </select>
            </div>
            <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '10px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', color: '#94a3b8', marginBottom: '0.75rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <span>Temperature</span> <span style={{ color: '#38bdf8' }}>{temperature}°C</span>
              </label>
              <input type="range" min="10" max="45" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }} />
            </div>
            <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '10px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', color: '#94a3b8', marginBottom: '0.75rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <span>Time Window</span> <span style={{ color: '#38bdf8' }}>{hour.toString().padStart(2, '0')}:00 Hrs</span>
              </label>
              <input type="range" min="0" max="23" value={hour} onChange={(e) => setHour(Number(e.target.value))} style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }} />
            </div>
          </div>
          <button type="submit" disabled={loading || !backendStatus.connected} style={{ alignSelf: 'center', width: '100%', maxWidth: '400px', backgroundColor: '#38bdf8', color: '#020617', padding: '1rem 1.5rem', borderRadius: '8px', border: 'none', fontSize: '1.1rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)' }}>
            {loading ? 'Evaluating Network...' : 'Execute Tactical Pipeline'}
          </button>
        </form>

        {/* DARK MODE MAP CONTAINER */}
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155', marginBottom: '2.5rem', height: '400px', width: '100%', filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(85%)' }}>
          <MapContainer center={currentMapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ChangeMapView center={currentMapCenter} />
            
            {hubs.map(h => (
              <Marker key={`marker-${h}`} position={HUB_COORDINATES[h]}>
                <Popup><strong style={{ color: '#0f172a' }}>{h}</strong></Popup>
              </Marker>
            ))}

            {data && (
              <>
                <Circle center={HUB_COORDINATES[data.metrics.location]} radius={800} pathOptions={{ color: getTheme(data.metrics.severity).mapColor, fillColor: getTheme(data.metrics.severity).mapColor, fillOpacity: 0.4 }} />
                <Polyline positions={getRoutePolyline()} pathOptions={{ color: data.routing.is_diverted ? '#0284c7' : '#16a34a', weight: 6, dashArray: data.routing.is_diverted ? '10, 10' : '0' }} />
              </>
            )}
          </MapContainer>
        </div>

        {/* ANALYTICAL OUTPUT */}
        {data && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div style={{ backgroundColor: getTheme(data.metrics.severity).bg, border: `1px solid ${getTheme(data.metrics.severity).border}`, borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#cbd5e1', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Predicted Density</h3>
                <div style={{ fontSize: '3.5rem', fontWeight: '900', color: getTheme(data.metrics.severity).color, margin: '0.5rem 0', lineHeight: 1 }}>
                  {data.metrics.crowd.toLocaleString()}
                </div>
                <span style={{ display: 'inline-block', padding: '0.35rem 1rem', borderRadius: '999px', backgroundColor: 'rgba(0,0,0,0.2)', color: getTheme(data.metrics.severity).color, fontWeight: '800', fontSize: '0.85rem', border: `1px solid ${getTheme(data.metrics.severity).color}` }}>
                  {data.metrics.status}
                </span>
              </div>

              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: `6px solid ${getTheme(data.metrics.severity).color}` }}>
                <h3 style={{ margin: '0 0 0.75rem 0', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dispatch Alerts</h3>
                {data.metrics.severity === 'CRITICAL' || data.metrics.severity === 'HIGH' ? (
                  <p style={{ margin: 0, color: '#f8fafc', fontSize: '1rem', lineHeight: '1.6' }}>
                    <strong style={{ color: '#fca5a5' }}>⚠️ PERIMETER ADVISORY:</strong> Overload conditions tracked within <strong>{data.metrics.location}</strong>. Security gates locked.
                  </p>
                ) : (
                  <p style={{ margin: 0, color: '#f8fafc', fontSize: '1rem', lineHeight: '1.6' }}>
                    <strong style={{ color: '#86efac' }}>✅ CLEARANCE NOMINAL:</strong> Pathways across <strong>{data.metrics.location}</strong> are checking out normal.
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              
              {/* TIMELINE WITH LABELED AXES */}
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>24-Hour Predictive Flux Timeline</h3>
                <div style={{ width: '100%', height: '260px' }}>
                  <ResponsiveContainer>
                    {/* Added margin to make room for axis labels */}
                    <LineChart data={data.trends} margin={{ top: 10, right: 20, left: 20, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                      
                      {/* X AXIS WITH LABEL */}
                      <XAxis 
                        dataKey="time" 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        label={{ value: 'Temporal Window (Hours)', position: 'bottom', fill: '#cbd5e1', fontSize: 13, fontWeight: 600 }}
                      />
                      
                      {/* Y AXIS WITH LABEL */}
                      <YAxis 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        width={50}
                        label={{ value: 'Density', angle: -90, position: 'insideLeft', fill: '#cbd5e1', fontSize: 13, fontWeight: 600, dx: -10 }}
                      />
                      
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', color: '#f8fafc' }} />
                      <Line type="monotone" dataKey="crowd" stroke="#38bdf8" strokeWidth={4} dot={{ r: 5, fill: '#0f172a', stroke: '#38bdf8', strokeWidth: 2 }} activeDot={{ r: 8, fill: '#38bdf8' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Network Routing Vector</h3>
                {data.routing.is_diverted ? (
                  <>
                    <div style={{ marginBottom: '0.75rem', textDecoration: 'line-through', color: '#64748b', fontSize: '0.95rem' }}>
                      Standard Axis: {data.routing.primary_time} mins
                    </div>
                    <div style={{ padding: '1.25rem', backgroundColor: 'rgba(2, 132, 199, 0.15)', borderLeft: '4px solid #38bdf8', borderRadius: '0 8px 8px 0' }}>
                      <div style={{ color: '#7dd3fc', fontWeight: '800', fontSize: '0.95rem', marginBottom: '0.35rem', textTransform: 'uppercase' }}>Diverted Corridor Initiated</div>
                      <div style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{data.routing.alternate}</div>
                      <div style={{ color: '#38bdf8', fontWeight: '700', fontSize: '0.95rem' }}>
                        ETA: {data.routing.alternate_time} mins (Saves {data.routing.savings} mins)
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '1.25rem', backgroundColor: 'rgba(22, 163, 74, 0.15)', borderLeft: '4px solid #4ade80', borderRadius: '0 8px 8px 0' }}>
                    <div style={{ color: '#86efac', fontWeight: '800', fontSize: '0.95rem', marginBottom: '0.35rem', textTransform: 'uppercase' }}>Primary Axis Unimpeded</div>
                    <div style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{data.routing.primary}</div>
                    <div style={{ color: '#4ade80', fontWeight: '700', fontSize: '0.95rem' }}>
                      ETA: {data.routing.primary_time} mins
                    </div>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}

export default App;