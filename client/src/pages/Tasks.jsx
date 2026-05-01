import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Check, 
    Circle, 
    Plus, 
    Calendar, 
    Clock, 
    Trash, 
    AlertCircle,
    ChevronRight,
    Trophy,
    Target,
    ListTodo
} from 'lucide-react';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        deadlineDate: '',
        deadlineTime: ''
    });

    const token = localStorage.getItem('token');

    const fetchTasks = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/v1/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data.data);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const deadline = new Date(`${newTask.deadlineDate}T${newTask.deadlineTime}`);
            const res = await axios.post('http://localhost:5000/api/v1/tasks', 
                { 
                    title: newTask.title, 
                    description: newTask.description,
                    deadline: deadline.toISOString()
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks([...tasks, res.data.data]);
            setNewTask({ title: '', description: '', deadlineDate: '', deadlineTime: '' });
            setShowAddForm(false);
        } catch (err) {
            alert('Failed to add task. Please ensure all fields are filled.');
        }
    };

    const toggleStatus = async (task) => {
        const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
        try {
            const res = await axios.put(`http://localhost:5000/api/v1/tasks/${task._id}`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks(tasks.map(t => t._id === task._id ? res.data.data : t));
        } catch (err) {
            console.error('Error updating task:', err);
        }
    };

    const deleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this goal?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/v1/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(tasks.filter(t => t._id !== id));
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    if (loading) return <Layout>Loading Goals...</Layout>;

    const pendingTasks = tasks.filter(t => t.status === 'Pending');
    const completedTasks = tasks.filter(t => t.status === 'Completed');

    return (
        <Layout 
            title="Strategic Milestones" 
            subtitle="Track your academic checkpoints and career progression goals. Break down your journey into manageable objectives."
        >
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            <Target size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Objective Manager</h2>
                            <p className="text-small" style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{pendingTasks.length} objectives currently active</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="btn-primary"
                        style={{ padding: '14px 28px' }}
                    >
                        <Plus size={20} strokeWidth={2.5} /> New Objective
                    </button>
                </header>

                <AnimatePresence>
                    {showAddForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="card-premium"
                            style={{ marginBottom: '64px' }}
                        >
                            <div className="card-inner" style={{ padding: '40px' }}>
                                <form onSubmit={handleAddTask}>
                                    <div style={{ marginBottom: '32px' }}>
                                        <label className="text-small" style={{ color: 'var(--text-main)', marginBottom: '12px', display: 'block', fontWeight: '800' }}>OBJECTIVE TITLE</label>
                                        <input 
                                            type="text" 
                                            placeholder="What is your next target?" 
                                            value={newTask.title}
                                            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                            required
                                            className="input-premium"
                                            style={{ fontSize: '1.2rem', fontWeight: '700' }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '32px' }}>
                                        <label className="text-small" style={{ color: 'var(--text-main)', marginBottom: '12px', display: 'block', fontWeight: '800' }}>STRATEGIC DESCRIPTION</label>
                                        <textarea 
                                            placeholder="Define the significance and core steps..."
                                            value={newTask.description}
                                            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                                            className="input-premium"
                                            style={{ minHeight: '120px' }}
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px' }}>
                                        <div>
                                            <label className="text-small" style={{ color: 'var(--text-main)', marginBottom: '12px', display: 'block', fontWeight: '800' }}>TARGET DATE</label>
                                            <input 
                                                type="date" 
                                                value={newTask.deadlineDate}
                                                onChange={(e) => setNewTask({...newTask, deadlineDate: e.target.value})}
                                                required
                                                className="input-premium"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-small" style={{ color: 'var(--text-main)', marginBottom: '12px', display: 'block', fontWeight: '800' }}>TARGET TIME</label>
                                            <input 
                                                type="time" 
                                                value={newTask.deadlineTime}
                                                onChange={(e) => setNewTask({...newTask, deadlineTime: e.target.value})}
                                                required
                                                className="input-premium"
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '16px' }}>Secure Objective</button>
                                        <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary" style={{ flex: 1, padding: '16px' }}>Discard</button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{ marginBottom: '64px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        <ListTodo size={20} color="var(--primary)" strokeWidth={2.5} />
                        <h3 className="text-small" style={{ color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Path ({pendingTasks.length})</h3>
                    </div>
                    {pendingTasks.length === 0 ? (
                        <div className="card-premium">
                            <div className="card-inner" style={{ textAlign: 'center', padding: '64px', background: 'var(--bg-app)' }}>
                                <p style={{ color: 'var(--text-muted)', fontWeight: '600', margin: 0 }}>All current objectives secured. Ready for the next challenge?</p>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                            {pendingTasks.map((task) => (
                                <TaskCard key={task._id} task={task} onToggle={toggleStatus} onDelete={deleteTask} />
                            ))}
                        </div>
                    )}
                </div>

                {completedTasks.length > 0 && (
                    <div className="fade-up">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <Trophy size={20} color="var(--success)" strokeWidth={2.5} />
                            <h3 className="text-small" style={{ color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Accomplishments ({completedTasks.length})</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', opacity: 0.8 }}>
                            {completedTasks.map((task) => (
                                <TaskCard key={task._id} task={task} onToggle={toggleStatus} onDelete={deleteTask} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

const TaskCard = ({ task, onToggle, onDelete }) => {
    const isCompleted = task.status === 'Completed';
    const deadline = new Date(task.deadline);
    const isOverdue = !isCompleted && deadline < new Date();

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-premium"
        >
            <div className="card-inner" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div 
                    onClick={() => onToggle(task)}
                    style={{ 
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        border: '2px solid',
                        borderColor: isCompleted ? 'var(--primary)' : 'var(--border-subtle)',
                        background: isCompleted ? 'var(--primary)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        color: 'white'
                    }}
                >
                    {isCompleted && <Check size={20} strokeWidth={3} />}
                </div>
                
                <div style={{ flex: 1 }}>
                    <h4 style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: '800', 
                        color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)',
                        textDecoration: isCompleted ? 'line-through' : 'none',
                        marginBottom: '8px',
                        letterSpacing: '-0.01em'
                    }}>
                        {task.title}
                    </h4>
                    {task.description && (
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>{task.description}</p>
                    )}
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: isOverdue ? 'var(--danger)' : 'var(--text-muted)', fontWeight: '700' }}>
                            <Calendar size={16} /> {deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: isOverdue ? 'var(--danger)' : 'var(--text-muted)', fontWeight: '700' }}>
                            <Clock size={16} /> {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {isOverdue && (
                            <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>OVERDUE</span>
                        )}
                    </div>
                </div>

                <button 
                    onClick={() => onDelete(task._id)}
                    className="btn-secondary"
                    style={{ border: 'none', color: 'var(--text-muted)', padding: '12px', background: 'transparent' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--danger)';
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-muted)';
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <Trash size={20} />
                </button>
            </div>
        </motion.div>
    );
};

export default Tasks;
