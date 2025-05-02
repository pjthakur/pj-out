"use client";

import { useState, useEffect, useMemo } from 'react';
import { faker } from '@faker-js/faker';
import ReactECharts from 'echarts-for-react';

interface Employee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  team: string;
  pullRequests: PullRequestData[];
}

interface Team {
  id: string;
  name: string;
  manager: string;
  employees: Employee[];
}

interface PullRequestData {
  week: string; // Format: 'Week X'
  count: number;
}

interface Note {
  employeeId: string;
  content: string;
  timestamp: number;
}

const colorPalettes = {
  line: {
    color: '#36A2EB',
    areaColor: 'rgba(54, 162, 235, 0.2)'
  },
  bar: {
    colors: [
      '#36A2EB',
      '#FF6384',
      '#4BC0C0',
      '#FF9F40',
      '#9966FF'
    ]
  }
};

const generatePullRequests = (weekCount: number): PullRequestData[] => {
  return Array.from({ length: weekCount }, (_, i) => ({
    week: `Week ${i + 1}`,
    count: faker.number.int({ min: 0, max: 20 })
  }));
};

const generateEmployees = (count: number, teamName: string): Employee[] => {
  return Array.from({ length: count }, () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    return {
      id: faker.string.uuid(),
      name: `${firstName} ${lastName}`,
      avatar: faker.image.avatar(),
      role: faker.person.jobTitle(),
      team: teamName,
      pullRequests: generatePullRequests(12) // 12 weeks of data
    };
  });
};

const generateTeams = (): Team[] => {
  const teamNames = ['Frontend', 'Backend', 'DevOps', 'QA', 'Design'];
  
  return teamNames.map(name => {
    const managerFirstName = faker.person.firstName();
    const managerLastName = faker.person.lastName();
    
    return {
      id: faker.string.uuid(),
      name,
      manager: `${managerFirstName} ${managerLastName}`,
      employees: generateEmployees(faker.number.int({ min: 3, max: 8 }), name)
    };
  });
};

export default function PerformaWeekly() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar'>('bar');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState<number>(12); 
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');

  useEffect(() => {
    const generatedTeams = generateTeams();
    setTeams(generatedTeams);
    setSelectedTeam(generatedTeams[0]);
    
    const savedDarkMode = localStorage.getItem('performaDarkMode');
    if (savedDarkMode) {setIsDarkMode(savedDarkMode === 'true');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
    
    const savedNotes = localStorage.getItem('performaNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('performaDarkMode', String(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const saveNote = () => {
    if (!selectedEmployee || !currentNote.trim()) return;
    const newNote: Note = {
      employeeId: selectedEmployee.id,
      content: currentNote,
      timestamp: Date.now()
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem('performaNotes', JSON.stringify(updatedNotes));
    setCurrentNote('');
  };

  const getCurrentEmployeeNote = useMemo(() => {
    if (!selectedEmployee) return '';
    const note = notes.find(note => note.employeeId === selectedEmployee.id);
    return note?.content || '';
  }, [selectedEmployee, notes]);

  useEffect(() => {
    setCurrentNote(getCurrentEmployeeNote);
  }, [selectedEmployee, getCurrentEmployeeNote]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const filteredEmployees = useMemo(() => {
    if (!selectedTeam) return [];
    
    return selectedTeam.employees.filter(employee => 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedTeam, searchQuery]);

  const prepareChartData = (data: PullRequestData[], type: 'line' | 'bar') => {
    const limitedData = data.slice(0, timeRange);
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: limitedData.map(d => d.week),
        axisLine: {
          lineStyle: {
            color: isDarkMode ? '#fff' : '#333'
          }
        },
        axisLabel: {
          color: isDarkMode ? '#ccc' : '#333'
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: isDarkMode ? '#fff' : '#333'
          }
        },
        axisLabel: {
          color: isDarkMode ? '#ccc' : '#333'
        },
        splitLine: {
          lineStyle: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      series: [{
        name: selectedEmployee ? `${selectedEmployee.name}'s Pull Requests` : `${selectedTeam?.name} Team Pull Requests`,
        type: type,
        data: limitedData.map(d => d.count),
        itemStyle: {
          color: type === 'line' 
            ? colorPalettes.line.color 
            : (params: any) => colorPalettes.bar.colors[params.dataIndex % colorPalettes.bar.colors.length]
        },
        areaStyle: type === 'line' ? {
          color: colorPalettes.line.areaColor
        } : undefined,
        smooth: type === 'line',
        barWidth: type === 'bar' ? '60%' : undefined
      }]
    };

    return option;
  };

  const getTeamPullRequesData = (): PullRequestData[] => {
    if (!selectedTeam) return [];
    
    const teamData: PullRequestData[] = Array.from({ length: 12 }, (_, i) => ({week: `Week ${i + 1}`,
      count: 0
    }));
    
    selectedTeam.employees.forEach(employee => {
      employee.pullRequests.forEach((pr, index) => {
        teamData[index].count += pr.count;
      });
    });

    // employees.forEach(employee => {
    //   employee.pullRequests.forEach((pr, index) => {
    //     teamData[index].count += pr.count;
    //   });
    // });
    
    return teamData;
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? '#fff' : '#333',
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: selectedEmployee 
          ? `${selectedEmployee.name}'s Pull Requests (Last ${timeRange} Weeks)` 
          : `${selectedTeam?.name} Team Pull Requests (Last ${timeRange} Weeks)`,
        color: isDarkMode ? '#fff' : '#333',
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 18,
          weight: 'bold' as const
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkMode ? '#ccc' : '#333'
        }
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkMode ? '#ccc' : '#333',
          precision: 0
        },
        beginAtZero: true
      }
    },
  };

  const teamStats = useMemo(() => {
    if (!selectedTeam) return { totalPRs: 0, avgPRs: 0, topPerformer: null };
    
    const teamData = getTeamPullRequesData();
    const totalPRs = teamData.reduce((sum, week) => sum + week.count, 0);
    const avgPRs = totalPRs / selectedTeam.employees.length;
    
    let topPerformer = { id: '', name: '', total: 0 };
    selectedTeam.employees.forEach(employee => {
      const employeeTotal = employee.pullRequests.reduce((sum, pr) => sum + pr.count, 0);
    if (employeeTotal > topPerformer.total) {topPerformer = { id: employee.id, name: employee.name, total: employeeTotal };}
    });
    
    return { totalPRs, avgPRs, topPerformer };
  }, [selectedTeam]);

  const currentChartData = selectedEmployee 
    ? prepareChartData(selectedEmployee.pullRequests, chartType)
    : prepareChartData(getTeamPullRequesData(), chartType);

  const employeeNotes = useMemo(() => {
    if (!selectedEmployee) return [];
    return notes.filter(note => note.employeeId === selectedEmployee.id).sort((a, b) => a.timestamp - b.timestamp);
  }, [selectedEmployee, notes]);

  return (
    <main className={`min-h-screen flex flex-col transition-colors duration-300 relative ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      {isDarkMode && (
        <div className="fixed inset-0 bg-gray-900 z-0"></div>
      )}
      <div className="relative z-10">
        <div className={`sticky top-0 z-10 shadow-md border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4">
            {/* Top row: logo left, dark mode toggle right (mobile and desktop) */}
            <div className="flex flex-row justify-between items-center sm:col-span-3">
              <div className="flex flex-row items-center gap-2">
                <svg className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L1 7v10l11 7 11-7V7L12 0zm-1 12H7V8h4v4zm6 0h-4V8h4v4z" />
                </svg>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Performa Weekly
                </h1>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full focus:outline-none ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                {isDarkMode ? (
                  <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
            {/* Second row: team select/search, full width on mobile, centered on desktop */}
            <div className="w-full flex justify-center sm:col-span-3">
              <div className="relative w-full max-w-xs">
                <select
                  className={`appearance-none border rounded-md py-2 pl-3 pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-100 border-gray-300 text-gray-800'
                  }`}
                  value={selectedTeam?.id || ''}
                  onChange={(e) => {
                    const team = teams.find(t => t.id === e.target.value);
                    setSelectedTeam(team || null);
                    setSelectedEmployee(null);
                  }}
                >
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name} Team</option>
                  ))}
                </select>
                <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className={`text-xl font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              {selectedTeam ? `${selectedTeam.name} Team` : 'Team'} Performance Dashboard
            </h2>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              Manager: {selectedTeam?.manager || 'Not Selected'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`border rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Total Pull Requests</h3>
                <span className={`p-2 rounded-full ${isDarkMode ? 'text-blue-400 bg-blue-900/30' : 'text-blue-600 bg-blue-100'}`}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </span>
              </div>
              <div className="text-sm dark:text-white" style={{ color: isDarkMode ? undefined : '#111' }}>{teamStats.totalPRs}</div>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last {timeRange} weeks</p>
            </div>
            
            <div className={`border rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Avg Pull Requests</h3>
                <span className={`p-2 rounded-full ${isDarkMode ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-100'}`}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </span>
              </div>
              <div className="text-sm dark:text-white" style={{ color: isDarkMode ? undefined : '#111' }}>{teamStats.avgPRs.toFixed(1)}</div>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Per employee</p>
            </div>
            
            <div className={`border rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Top Performer</h3>
                <span className={`p-2 rounded-full ${isDarkMode ? 'text-purple-400 bg-purple-900/30' : 'text-purple-600 bg-purple-100'}`}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </span>
              </div>
              <div className="text-xl font-semibold truncate dark:text-white" style={{ color: isDarkMode ? undefined : '#111' }}>{teamStats.topPerformer?.name || 'N/A'}</div>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {teamStats.topPerformer ? `${teamStats.topPerformer.total} Pull Requests` : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  className={`px-4 py-2 rounded-l-lg text-sm font-medium focus:z-10 focus:outline-none ${
                    chartType === 'line' 
                      ? 'bg-blue-600 text-white' 
                      : `${isDarkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`
                  }`}
                  onClick={() => setChartType('line')}
                >
                  Line Chart
                </button>
                <button
                  className={`px-4 py-2 rounded-r-lg text-sm font-medium focus:z-10 focus:outline-none ${
                    chartType === 'bar' 
                      ? 'bg-blue-600 text-white' 
                      : `${isDarkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`
                  }`}
                  onClick={() => setChartType('bar')}
                >
                  Bar Chart
                </button>
              </div>
              
              <div className="flex items-center">
                <label className={`mr-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Time Range:</label>
                <select
                  className={`border rounded-md text-sm py-1 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  value={timeRange}
                  onChange={(e) => setTimeRange(parseInt(e.target.value))}
                >
                  <option value="4">4 Weeks</option>
                  <option value="8">8 Weeks</option>
                  <option value="12">12 Weeks</option>
                </select>
              </div>
            </div>
            
            {selectedEmployee && (
              <button
                className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                onClick={() => setSelectedEmployee(null)}
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Return to Team View
              </button>
            )}
          </div>
          <div className={`${isDarkMode ? "bg-black/30 backdrop-blur-md border border-gray-700/60" : "bg-white border border-gray-200"} rounded-xl shadow-lg p-6 mb-8`}>
            <div className="h-80">
              <ReactECharts
                option={prepareChartData(
                  selectedEmployee ? selectedEmployee.pullRequests : getTeamPullRequesData(),
                  chartType
                )}
                style={{ height: '100%', width: '100%' }}
                theme={isDarkMode ? 'dark' : 'light'}
              />
            </div>
          </div>

          {/* Synchronized height wrapper for both columns */}
          <div className="flex flex-col lg:flex-row gap-8 max-h-[450px] h-[450px]">
            <div className="w-full lg:w-2/3 h-full max-h-full">
              <div className={`rounded-xl shadow-lg p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} h-full max-h-full flex flex-col`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold dark:text-white" style={{ color: isDarkMode ? undefined : '#111' }}>Team Members</h3>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search employees..."
                      className={`pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${
                        isDarkMode ? 'bg-gray-700 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'
                      }`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="overflow-auto max-h-full h-full flex-1">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <tr>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          Employee
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          Role
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          Pull Requests
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {filteredEmployees.map(employee => {
                        const totalPRs = employee.pullRequests
                          .slice(0, timeRange)
                          .reduce((sum, pr) => sum + pr.count, 0);
                        
                        return (
                          <tr 
                            key={employee.id}
                            className={`${
                              selectedEmployee?.id === employee.id 
                                ? isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                                : ''
                            } ${
                              isDarkMode 
                                ? 'hover:bg-gray-700' 
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full overflow-hidden">
                                  <img src={employee.avatar} alt={employee.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium dark:text-white" style={{ color: isDarkMode ? undefined : '#111' }}>
                                    {employee.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-700 dark:text-gray-400">{employee.role}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm dark:text-white" style={{ color: isDarkMode ? undefined : '#111' }}>{totalPRs}</div>
                              <div className="text-xs text-gray-700 dark:text-gray-400">Last {timeRange} weeks</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                                onClick={() => setSelectedEmployee(employee)}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      
                      {filteredEmployees.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                            No employees match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Notes Section */}
            <div className="w-full lg:w-1/3 h-full max-h-full flex-1">
              <div className={`rounded-xl shadow-lg p-6 h-full border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} h-full max-h-full flex flex-col`}>
                <h3 className="text-lg font-semibold dark:text-white mb-4" style={{ color: isDarkMode ? undefined : '#111' }}>
                  {selectedEmployee ? `Notes for ${selectedEmployee.name}` : 'Select an employee to add notes'}
                </h3>
                {selectedEmployee ? (
                  <>
                    {/* Comment stack */}
                    <div className="flex flex-col gap-4 mb-4 h-full max-h-full overflow-y-auto pr-2 flex-1">
                      {employeeNotes.length === 0 && (
                        <div className="text-gray-400 text-sm text-center">No notes yet. Add the first note!</div>
                      )}
                      {employeeNotes.map((note, idx) => (
                        <div
                          key={note.timestamp}
                          className="flex items-start gap-3 animate-fadeIn"
                          style={{ animationDelay: `${idx * 60}ms` }}
                        >
                          <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            {/* Manager generic avatar SVG */}
                            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7">
                              <circle cx="20" cy="20" r="20" fill="#2563eb" />
                              <circle cx="20" cy="16" r="7" fill="#fff" />
                              <ellipse cx="20" cy="30" rx="10" ry="6" fill="#fff" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs dark:text-white" style={{ color: isDarkMode ? undefined : '#111' }}>Manager (Me)</span>
                              <span className="text-xs text-gray-400">{new Date(note.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="text-sm mt-1 dark:text-gray-200 whitespace-pre-line" style={{ color: isDarkMode ? undefined : '#111' }}>{note.content}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Add new note */}
                    <textarea
                      className={`w-full p-3 border rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-700 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                      placeholder="Add a note about this employee..."
                      value={currentNote}
                      onChange={(e) => setCurrentNote(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end mt-3">
                      <button
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md shadow-sm"
                        onClick={saveNote}
                      >
                        Add Note
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">
                    <svg className="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <p>Select an employee to view and add notes</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}