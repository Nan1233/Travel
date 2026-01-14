import React from 'react';

const ProfileCard = ({ user, onPreferenceChange }) => {
    return (
        <div className="card shadow-sm border-0 mb-4 p-3 bg-white">
            <div className="d-flex align-items-center">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{width: '60px', height: '60px', fontSize: '24px', flexShrink: 0}}>
                    {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow-1">
                    <h5 className="fw-bold mb-0 small">{user.fullName}</h5>
                    <p className="text-muted mb-2" style={{fontSize: '11px'}}>Sở thích: <span className="text-primary">{user.preferences}</span></p>
                    <div className="d-flex gap-1">
                        {['Bien', 'Nui', 'Van Hoa'].map(p => (
                            <button key={p} className={`btn btn-xs rounded-pill ${user.preferences === p ? 'btn-success' : 'btn-outline-secondary'}`}
                                onClick={() => onPreferenceChange(p)} style={{fontSize: '9px', padding: '2px 8px'}}>{p}</button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProfileCard;