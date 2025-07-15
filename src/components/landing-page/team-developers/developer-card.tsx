'use client';

import { GitHubUser } from '@/lib/api/services/github-service';
import { ExternalLink, Github, User2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface DeveloperCardProps {
  user: GitHubUser;
  role: string;
  className?: string;
}

export function DeveloperCard({ user, role, className }: DeveloperCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-lg bg-blue-50 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/50 ${className || ''}`}
    >
      {/* Subtle background gradient on hover */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

      {/* Main content */}
      <div className='relative z-10'>
        {/* Avatar with enhanced styling */}
        <div className='relative mx-auto mb-4 h-32 w-32'>
          <div className='absolute inset-0 scale-105 transform rounded-full bg-gradient-to-br from-blue-200 to-purple-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.name || user.login}
              fill
              className='relative z-10 rounded-full border-4 border-white object-cover shadow-md transition-all duration-300 group-hover:border-blue-100'
            />
          ) : (
            <div className='relative z-10 flex h-full w-full items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 shadow-md transition-all duration-300 group-hover:border-blue-100'>
              <User2 size={48} />
            </div>
          )}

          {/* GitHub link overlay */}
          <Link
            href={user.html_url}
            target='_blank'
            rel='noopener noreferrer'
            className='absolute inset-0 z-20 flex items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
          >
            <Github className='h-8 w-8 text-white' />
          </Link>
        </div>

        {/* Name with enhanced typography */}
        <h3 className='mb-2 line-clamp-1 text-xl font-bold text-blue-900 transition-colors duration-300 group-hover:text-blue-700'>
          {user.name || user.login}
        </h3>

        {/* Role with improved styling */}
        <div className='mb-3 inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 transition-colors duration-300 group-hover:bg-blue-200'>
          <span className='h-2 w-2 animate-pulse rounded-full bg-blue-500' />
          {role}
        </div>

        {/* Bio with better formatting */}
        {/* {user.bio && (
          <p className='mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-700'>
            {user.bio}
          </p>
        )} */}

        {/* GitHub username */}
        <div className='flex items-center justify-center gap-1 text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-600'>
          <Github className='h-3 w-3' />
          <span>@{user.login}</span>
        </div>

        {/* GitHub stats */}
        <div className='mt-4 flex items-center justify-center gap-4 border-t border-gray-200 pt-3 text-xs text-gray-500'>
          <div className='flex items-center gap-1'>
            <div className='h-2 w-2 rounded-full bg-green-500'></div>
            <span>{user.public_repos} repos</span>
          </div>
          <div className='flex items-center gap-1'>
            <div className='h-2 w-2 rounded-full bg-blue-500'></div>
            <span>{user.followers} followers</span>
          </div>
        </div>

        {/* Hover effect: View Profile button */}
        <Link
          href={user.html_url}
          target='_blank'
          rel='noopener noreferrer'
          className='absolute right-4 bottom-4 left-4 flex translate-y-2 transform items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-blue-700'
        >
          Ver Perfil
          <ExternalLink className='h-4 w-4' />
        </Link>
      </div>
    </div>
  );
}
