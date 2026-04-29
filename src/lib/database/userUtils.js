export function safeProgress(progress) {
  if (!progress) return { level: 0, keys: [], credits: 0 };

  if (typeof progress === 'string') {
    try {
      return JSON.parse(progress);
    } catch {
      return { level: 0, keys: [], credits: 0 };
    }
  }

  return progress;
}

export function buildUserResponse(user) {
  return {
    id: user.id,
    name: user.name,
    nickname: user.nickname,
    email: user.email,
    progress: safeProgress(user.progress),
    is_admin: user.is_admin ? 1 : 0,
  };
}
