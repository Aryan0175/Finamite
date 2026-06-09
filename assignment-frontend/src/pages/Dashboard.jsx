import { useState, useEffect } from 'react';
import { getTasksAPI, createTaskAPI, updateTaskAPI, deleteTaskAPI, getTaskStatsAPI } from '../api/task.api';
import { Plus, Trash2, Search, CheckCircle, Clock, ListTodo, Edit2, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ totalTasks: 0, pendingTasks: 0, completedTasks: 0, 
    completedToday: 0, 
    completedThisWeek: 0 });
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [formData, setFormData] = useState({ title: '', description: '', priority: 'Medium', dueDate: '' });
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
        }, 500); 
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        fetchDashboardData();
    }, [statusFilter, debouncedSearch]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [tasksData, statsData] = await Promise.all([
                getTasksAPI(statusFilter, debouncedSearch),
                getTaskStatsAPI()
            ]);
            setTasks(tasksData);
            setStats(statsData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const handleSubmitTask = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;
        
        try {
            setActionLoading(true);
            if (editingTaskId) {
                await updateTaskAPI(editingTaskId, formData);
            } else {
                await createTaskAPI(formData);
            }
            resetForm();
            fetchDashboardData(); 
        } catch (err) {
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleEditClick = (task) => {
        setFormData({
            title: task.title,
            description: task.description || '',
            priority: task.priority || 'Medium',
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
        });
        setEditingTaskId(task._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', priority: 'Medium', dueDate: '' });
        setEditingTaskId(null);
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await updateTaskAPI(taskId, { status: newStatus });
            fetchDashboardData(); 
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Delete this task permanently?')) return;
        try {
            await deleteTaskAPI(taskId);
            fetchDashboardData();
        } catch (err) {
            alert(err.message);
        }
    };

    const TaskCard = ({ task }) => {
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status === 'Pending';
        const priorityColor = task.priority === 'High' ? 'text-red-600' : task.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600';

        return (
            <div className={`bg-white p-5 rounded-xl shadow-sm border mb-4 transition hover:shadow-md ${isOverdue ? 'border-red-400 bg-red-50/30' : 'border-gray-200'}`}>
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-bold text-lg ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                {task.title}
                            </h3>
                            {isOverdue && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">OVERDUE</span>}
                        </div>
                        <p className="text-gray-600 text-sm mb-3 whitespace-pre-wrap">{task.description || 'No description provided.'}</p>
                        
                        <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-500">
                            <span className={`bg-gray-100 px-2 py-1 rounded ${priorityColor}`}>🔥 {task.priority} Priority</span>
                            {task.dueDate && <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                            <span>🕒 Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:flex-col md:items-end">
                        <select 
                            value={task.status} 
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            className={`border text-sm font-bold p-1.5 rounded outline-none ${task.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}
                        >
                            <option value="Pending">⏳ Pending</option>
                            <option value="In Progress">🚀 In Progress</option>
                            <option value="Completed">✅ Completed</option>
                        </select>
                        
                        <div className="flex gap-2 mt-2">
                            <button onClick={() => handleEditClick(task)} className="text-gray-400 hover:text-blue-500 transition p-1 bg-gray-50 rounded" title="Edit Task">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteTask(task._id)} className="text-gray-400 hover:text-red-500 transition p-1 bg-gray-50 rounded" title="Delete Task">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><ListTodo size={24} /></div>
                    <div><p className="text-gray-500 text-sm font-bold">Total Tasks</p><p className="text-2xl font-black">{stats.totalTasks}</p></div>
                </div>
                <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg"><Clock size={24} /></div>
                    <div><p className="text-gray-500 text-sm font-bold">Pending</p><p className="text-2xl font-black">{stats.pendingTasks}</p></div>
                </div>
                <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckCircle size={24} /></div>
                    <div><p className="text-gray-500 text-sm font-bold">Completed</p><p className="text-2xl font-black">{stats.completedTasks}</p></div>
                </div>
                <div className="bg-white border border-green-400 bg-green-50/30 p-4 rounded-xl shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-green-700 text-xs font-bold uppercase tracking-wide mb-1">Completed Today</p>
                    <p className="text-3xl font-black text-green-600">{stats.completedToday}</p>
                </div>
                <div className="bg-white border border-green-400 bg-green-50/30 p-4 rounded-xl shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-green-700 text-xs font-bold uppercase tracking-wide mb-1">Completed This Week</p>
                    <p className="text-3xl font-black text-green-600">{stats.completedThisWeek}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <form onSubmit={handleSubmitTask} className={`bg-white p-5 rounded-xl shadow-sm border sticky top-4 transition-all ${editingTaskId ? 'border-blue-500 shadow-blue-100' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                {editingTaskId ? <Edit2 size={18} className="text-blue-500"/> : <Plus size={18}/>} 
                                {editingTaskId ? 'Edit Task' : 'New Task'}
                            </h2>
                            {editingTaskId && (
                                <button type="button" onClick={resetForm} className="text-gray-400 hover:text-red-500">
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Title *</label>
                                <input required placeholder="Task title..." className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500"
                                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                                <textarea placeholder="Task details..." className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500 h-20"
                                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>
                            <div className="flex gap-3">
                                <div className="w-1/2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Priority</label>
                                    <select className="w-full border p-2 rounded text-sm outline-none"
                                        value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div className="w-1/2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Due Date</label>
                                    <input type="date" className="w-full border p-2 rounded text-sm outline-none"
                                        value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 mt-4">
                                <Button type="submit" isLoading={actionLoading} className="w-full">
                                    {editingTaskId ? 'Update Task' : 'Create Task'}
                                </Button>
                                {editingTaskId && (
                                    <button type="button" onClick={resetForm} className="w-full px-4 py-2 bg-gray-50 text-gray-600 font-bold rounded hover:bg-gray-100 border transition">
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="lg:col-span-2">
                    <div className="flex flex-col sm:flex-row gap-3 mb-5">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input 
                                type="text" placeholder="Search tasks..." 
                                value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:border-blue-500 transition"
                            />
                        </div>
                        <select 
                            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                            className="border p-2 rounded-lg text-sm font-bold text-gray-700 outline-none"
                        >
                            <option value="All">All Tasks</option>
                            <option value="Pending">Pending Only</option>
                            <option value="In Progress">In Progress Only</option>
                            <option value="Completed">Completed Only</option>
                        </select>
                    </div>

                    {loading ? <div className="flex justify-center py-10"><Loader /></div> : (
                        tasks.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 font-medium">No tasks found. Create one to get started!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tasks.map(task => <TaskCard key={task._id} task={task} />)}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;