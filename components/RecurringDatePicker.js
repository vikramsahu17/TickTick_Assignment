import { useRecurringStore } from '../store/useRecurringStore';
import { useState, useEffect } from 'react';
import { RRule } from 'rrule';
import { Pencil, Trash2 } from 'lucide-react';

export default function RecurringDatePicker() {
  const { tasks, addTask, deleteTask, updateTask, setEditingTask, editingTask } = useRecurringStore();

  const [taskName, setTaskName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [interval, setInterval] = useState(1);
  const [endType, setEndType] = useState('never');
  const [count, setCount] = useState(5);
  const [untilDate, setUntilDate] = useState('');

  const isEditing = editingTask !== null;

  useEffect(() => {
    if (editingTask) {
      const task = tasks.find(t => t.id === editingTask);
      if (task) {
        setTaskName(task.name);
        setStartDate(task.startDate);
        setFrequency(task.freq);
        setInterval(task.interval);
        setEndType(task.endType);
        setCount(task.count || 5);
        setUntilDate(task.until || '');
      }
    }
  }, [editingTask]);

  const handleSubmit = () => {
    if (!taskName || !startDate) return alert('Task name and start date required');

    const options = {
      freq: RRule[frequency.toUpperCase()],
      interval: parseInt(interval),
      dtstart: new Date(startDate),
    };

    if (endType === 'count') options.count = parseInt(count);
    else if (endType === 'until' && untilDate) options.until = new Date(untilDate);

    const rule = new RRule(options);
    const ruleString = rule.toString();
    const dates = rule.all().slice(0, 3).map(d => d.toDateString());

    const task = {
      id: isEditing ? editingTask : Date.now(),
      name: taskName,
      startDate,
      freq: frequency,
      interval,
      endType,
      count,
      until: untilDate,
      ruleString,
      preview: dates,
    };

    if (isEditing) updateTask(task);
    else addTask(task);

    setTaskName('');
    setStartDate('');
    setFrequency('daily');
    setInterval(1);
    setEndType('never');
    setCount(5);
    setUntilDate('');
    setEditingTask(null);
  };

  return (
    <div className="bg-zinc-900 p-8 rounded-xl shadow-xl space-y-6 text-white">
      <h2 className="text-2xl font-bold mb-4">📅 Create Recurring Task</h2>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold">Task Name:</label>
          <input type="text" className="input" value={taskName} onChange={e => setTaskName(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Start Date:</label>
          <input type="date" className="input" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Frequency:</label>
          <select className="input" value={frequency} onChange={e => setFrequency(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Interval:</label>
          <input type="number" min="1" className="input" value={interval} onChange={e => setInterval(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-semibold">End Condition:</label>
          <select className="input" value={endType} onChange={e => setEndType(e.target.value)}>
            <option value="never">Never</option>
            <option value="count">After X Occurrences</option>
            <option value="until">Until Specific Date</option>
          </select>
        </div>
        {endType === 'count' && (
          <div>
            <label className="block mb-1 font-semibold">Occurrences:</label>
            <input type="number" className="input" value={count} onChange={e => setCount(e.target.value)} />
          </div>
        )}
        {endType === 'until' && (
          <div>
            <label className="block mb-1 font-semibold">Until Date:</label>
            <input type="date" className="input" value={untilDate} onChange={e => setUntilDate(e.target.value)} />
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg font-semibold transition-all"
      >
        {isEditing ? 'Update Task' : 'Add Task'}
      </button>


      {/* Task List */}
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4">🗂️ Task List</h3>
        {tasks.length === 0 && <p className="text-gray-400">No tasks added yet.</p>}
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="bg-zinc-800 rounded-lg p-4 shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold">{task.name}</h4>
                  <p className="text-sm text-gray-400">
                    Starts on <span className="text-white">{new Date(task.startDate).toDateString()}</span>
                  </p>
                  <p className="text-sm text-gray-500 truncate max-w-full">Rule: {task.ruleString}</p>
                  <p className="text-sm text-gray-400 mt-1">Next Dates:</p>
                  <ul className="list-disc list-inside text-white text-sm">
                    {task.preview.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingTask(task.id)} className="text-yellow-400 hover:text-yellow-300">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-400">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
