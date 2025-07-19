import Head from 'next/head';
import RecurringDatePicker from '../components/RecurringDatePicker';


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4 py-8">
      <Head>
        <title>Recurring Date Picker</title>
      </Head>
      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Recurring Task Scheduler
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Plan your repeating tasks with ease and precision.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-lg border border-white/10">
          <RecurringDatePicker />
        </div>
      </main>
    </div>
  );
}
