import React, { useEffect, useState } from 'react';
import { LogOut, Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '../context/AuthContext';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Dashboard = () => {
  const { user, logout, tasks, fetchTasks, createTask, deleteTask, taskStatus } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const success = await createTask({ title: newTaskTitle, description: newTaskDesc });
    if (success) {
      setIsModalOpen(false);
      setNewTaskTitle('');
      setNewTaskDesc('');
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Welcome, <span className="font-semibold text-gray-900">{user?.name}</span>
            {isAdmin && <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium">Admin</span>}
          </div>
          <Button variant="ghost" onClick={logout} className="text-gray-500 hover:text-gray-700">
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Create Task
          </Button>
        </div>

        {taskStatus === 'loading' && tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
              <Plus className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900">No tasks</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
            <div className="mt-6">
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-5 w-5 mr-2" />
                New Task
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <Card key={task._id} className="flex flex-col">
                <CardContent className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{task.description}</p>
                </CardContent>
                {isAdmin && (
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
                    <Button 
                      variant="danger" 
                      onClick={() => deleteTask(task._id)}
                      className="!px-3 !py-1.5 text-xs"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white shadow-xl">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <Input
                  label="Title"
                  id="task-title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                  autoFocus
                />
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="task-desc" className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="task-desc"
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    required
                    className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={taskStatus === 'loading'}>
                    Create Task
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
