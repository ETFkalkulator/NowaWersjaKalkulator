/* ============================================================
   charts-config.js — ETFkalkulator.pl
   Centralna konfiguracja Chart.js dla wszystkich modułów.
   Gwarantuje spójny wygląd (Apple style) i wydajność.
   ============================================================ */

window.ETF = window.ETF || {};

window.ETF.charts = (function() {
    
    // Helper to get computed CSS variables if needed
    const getStyle = (prop) => getComputedStyle(document.documentElement).getPropertyValue(prop).trim();

    return {
        // Paleta kolorów Apple System Colors
        colors: {
            primary: '#1A56A0', // Brand Blue from PRD

            success: '#34C759', // Green
            accent: '#FF9500',  // Orange
            muted: '#8E8E93',   // Gray
            error: '#FF3B30',   // Red
            teal: '#30B0C7',
            blue: '#0d7ff2',
            grid: 'rgba(0, 0, 0, 0.05)',
            gridDark: 'rgba(255, 255, 255, 0.08)'
        },

        // Domyślne opcje dla wykresów liniowych (Apple-style)
        getBaseOptions: function(title) {
            const isDark = document.documentElement.classList.contains('dark-mode');
            const isMobile = window.innerWidth < 768;
            const textColor = isDark ? '#AEAEB2' : '#6E6E73';
            const titleColor = isDark ? '#F5F5F7' : '#1C1C1E';
            const gridColor = isDark ? this.colors.gridDark : this.colors.grid;

            
            return {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: isMobile ? 10 : 20,
                        bottom: 0,
                        left: isMobile ? 4 : 0,
                        right: isMobile ? 4 : 10
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        align: isMobile ? 'center' : 'end',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: isMobile ? 12 : 20,
                            boxWidth: isMobile ? 6 : 8,
                            boxHeight: isMobile ? 6 : 8,
                            font: { 
                                family: "'Inter', system-ui, -apple-system, sans-serif", 
                                size: isMobile ? 11 : 12,
                                weight: '500'
                            },
                            color: textColor
                        }
                    },
                    tooltip: {
                        enabled: true,
                        padding: isMobile ? 10 : 14,
                        backgroundColor: isDark ? 'rgba(44, 44, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        titleColor: titleColor,
                        bodyColor: textColor,
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)',
                        borderWidth: 1,
                        titleFont: { 
                            family: "'Inter', sans-serif",
                            weight: '600', 
                            size: isMobile ? 12 : 13 
                        },
                        bodyFont: { 
                            family: "'Inter', sans-serif",
                            size: isMobile ? 12 : 13 
                        },
                        cornerRadius: 10,
                        boxPadding: 6,
                        displayColors: true,
                        usePointStyle: true,
                        caretPadding: 8,
                        caretSize: 6,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('pl-PL', { 
                                        style: 'currency', 
                                        currency: 'PLN',
                                        maximumFractionDigits: 0
                                    }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },

                scales: {
                    x: {
                        grid: { 
                            display: false,
                            drawBorder: false
                        },
                        ticks: { 
                            color: textColor, 
                            font: { 
                                family: "'Inter', sans-serif",
                                size: window.innerWidth < 768 ? 10 : 11 
                            },
                            maxTicksLimit: window.innerWidth < 768 ? 5 : 10,
                            padding: 10,
                            autoSkip: true
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { 
                            color: gridColor,
                            drawBorder: false,
                            borderDash: [5, 5]
                        },
                        ticks: {
                            color: textColor,
                            font: { 
                                family: "'Inter', sans-serif",
                                size: window.innerWidth < 768 ? 10 : 11 
                            },
                            padding: 8,
                            maxTicksLimit: 6,
                            callback: function(value) {
                                if (value >= 1000000) return (value / 1000000).toFixed(1) + ' mln';
                                if (value >= 1000) return (value / 1000).toFixed(0) + ' tys.';
                                return value + ' zł';
                            }
                        }
                    }
                },

                elements: {
                    line: {
                        tension: 0.4,
                        borderCapStyle: 'round',
                        borderJoinStyle: 'round'
                    },
                    point: {
                        radius: 0,
                        hitRadius: 20,
                        hoverRadius: 5,
                        hoverBorderWidth: 2
                    }
                }
            };
        },

        // Helper to create dataset with standard Apple style
        createDataset: function(ctx, label, data, color) {
            const isMobile = window.innerWidth < 768;
            
            // Gradient fill (subtle)
            const canvas = ctx.canvas;
            if (!canvas) return { label, data, borderColor: color };
            
            const chartCtx = canvas.getContext('2d');
            const gradient = chartCtx.createLinearGradient(0, 0, 0, canvas.height || 400);
            
            // Hex to RGBA conversion for gradient
            let r, g, b;
            if (color.startsWith('#')) {
                r = parseInt(color.slice(1, 3), 16);
                g = parseInt(color.slice(3, 5), 16);
                b = parseInt(color.slice(5, 7), 16);
            } else {
                r = 26; g = 86; b = 160; // Default to brand blue
            }

            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.15)`);
            gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.05)`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

            return {
                label: label,
                data: data,
                borderColor: color,
                borderWidth: isMobile ? 3 : 3.5,
                backgroundColor: gradient,
                fill: true,
                pointBackgroundColor: color,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: color,
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
                tension: 0.4,
                pointRadius: 0,
                pointHitRadius: 20
            };
        }

    };
})();
