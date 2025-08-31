import React from 'react';
import '../style/TimeRangeFilter.css'; // Importamos sus estilos

// Definimos las opciones dentro del componente, ya que son específicas para este filtro.
const timeRangeOptions = {
    day: 'Hoy',
    week: 'Esta Semana',
    month: 'Este Mes',
    year: 'Este Año'
};

/**
 * Componente reutilizable para renderizar botones de filtro de rango de tiempo.
 * @param {object} props
 * @param {string} props.currentRange - El rango de tiempo actualmente seleccionado (ej: 'day', 'week').
 * @param {function} props.onRangeChange - Función callback que se ejecuta al seleccionar un nuevo rango.
 */
const TimeRangeFilter = ({ currentRange, onRangeChange }) => {
    return (
        <div className="time-filters">
            {Object.entries(timeRangeOptions).map(([key, label]) => (
                <button
                    key={key}
                    // Cuando se hace clic, llamamos a la función que nos pasaron por props.
                    onClick={() => onRangeChange(key)}
                    // La clase 'active' se aplica si el 'key' es igual al rango actual.
                    className={currentRange === key ? 'active' : ''}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default TimeRangeFilter;