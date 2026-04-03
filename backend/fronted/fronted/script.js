/**
 * Aegis AI Healthcare System - Frontend Logic
 * ECA Project for MIT Undergraduate Application
 * Created by: Jawad A.
 */

const API_URL = 'http://localhost:5000';

async function refreshData() {
    await loadPatients();
    await loadStats();
    await loadAlerts();
}

async function loadPatients() {
    try {
        const response = await fetch(${API_URL}/patients);
        const patients = await response.json();
        
        const grid = document.getElementById('patientGrid');
        grid.innerHTML = '';
        
        if (patients.length === 0) {
            grid.innerHTML = '<div class="loading">No patients found. Click "Add New Patient" to get started.</div>';
            return;
        }
        
        patients.forEach(patient => {
            const card = document.createElement('div');
            card.className = 'patient-card';
            
            let riskClass = '';
            if (patient.risk === 'Low') riskClass = 'risk-low';
            else if (patient.risk === 'Medium') riskClass = 'risk-medium';
            else riskClass = 'risk-high';
            
            card.innerHTML = `
                ${patient.risk === 'High' ? '<div class="alert-badge">⚠️ URGENT</div>' : ''}
                <h3>👨‍🏫 ${patient.name}</h3>
                <p>🎂 Age: ${patient.age} years</p>
                <p>❤️ Heart Rate: ${patient.heartRate} bpm</p>
                <p>💊 Blood Pressure: ${patient.bp}</p>
                <p>🌡️ Temperature: ${patient.temperature}°F</p>
                <p>⚠️ Risk Level: <span class="${riskClass}">${patient.risk}</span></p>
                ${patient.department ? <p>🏛️ ${patient.department}</p> : ''}
                <div class="card-actions">
                    <button class="btn-edit" onclick="editPatient(${patient.id})">✏️ Edit</button>
                    <button class="btn-delete" onclick="deletePatient(${patient.id})">🗑️ Delete</button>
                    <button class="btn-alert" onclick="checkAlert(${patient.id})">🔔 Alert</button>
                </div>
            `;
            grid.appendChild(card);
        });
        
        document.getElementById('totalPatients').textContent = patients.length;
        const highRiskCount = patients.filter(p => p.risk === 'High').length;
        document.getElementById('highRisk').textContent = highRiskCount;
        
    } catch (error) {
        document.getElementById('patientGrid').innerHTML = '<div class="loading">❌ Unable to load data. Please ensure backend is running on port 5000.</div>';
    }
}

async function loadStats() {
    try {
        const response = await fetch(${API_URL}/patients);
        const patients = await response.json();
        const highRiskCount = patients.filter(p => p.risk === 'High').length;
        document.getElementById('highRisk').textContent = highRiskCount;
    } catch (error) {
        console.error('Stats load error:', error);
    }
}

async function loadAlerts() {
    try {
        const response = await fetch(${API_URL}/alerts);
        const alerts = await response.json();
        document.getElementById('alertCount').textContent = alerts.length;
    } catch (error) {
        console.error('Alerts load error:', error);
    }
}

async function addPatient() {
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const bp = document.getElementById('bp').value || '120/80';
    const heartRate = document.getElementById('heartRate').value || 72;
    
    if (!name || !age) {
        alert('Please provide both name and age!');
        return;
    }
    
    const patient = {
        name,
        age: parseInt(age),
        bp,
        heartRate: parseInt(heartRate),
        temperature: 98.6
    };
    
    try {
        const response = await fetch(${API_URL}/patients, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patient)
        });
        
        if (response.ok) {
            hideForm();
            refreshData();
            alert(Patient ${name} has been successfully added.);
        }
    } catch (error) {
        alert('Failed to add patient. Please try again.');
    }
}

async function deletePatient(id) {
    if (confirm('Are you sure you want to delete this patient record?')) {
        try {
            await fetch(${API_URL}/patients/${id}, { method: 'DELETE' });
            refreshData();
            alert('Patient record deleted.');
        } catch (error) {
            alert('Failed to delete patient.');
        }
    }
}

async function checkAlert(id) {
    try {
        const response = await fetch(${API_URL}/patients/${id}/alerts, { method: 'POST' });
        const result = await response.json();
        if (result.message === 'No alert needed - condition stable') {
            alert('✅ No alert needed. Patient condition is stable.');
        } else {
            alert(⚠️ ${result.message});
        }
        loadAlerts();
    } catch (error) {
        alert('Failed to generate alert.');
    }
}

function editPatient(id) {
    alert(Edit functionality for patient ID ${id} will be available in the next update.);
}

function showAddPatientForm() {
    document.getElementById('addForm').style.display = 'flex';
}

function hideForm() {
    document.getElementById('addForm').style.display = 'none';
    document.getElementById('name').value = '';
    document.getElementById('age').value = '';
    document.getElementById('bp').value = '';
    document.getElementById('heartRate').value = '';
}

setInterval(refreshData, 10000);
refreshData();

async function checkSystemHealth() {
    try {
        const response = await fetch(${API_URL}/health);
        const data = await response.json();
        document.getElementById('systemStatus').innerHTML = '✅ Online';
    } catch (error) {
        document.getElementById('systemStatus').innerHTML = '❌ Offline';
    }
}

checkSystemHealth();
setInterval(checkSystemHealth, 30000);
