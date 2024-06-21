function requireUser(req: any, res: any, next: any) {
  if (!req.user) {
    return next(new Error('Uninitialized'))
  };
  next();
}

export default requireUser;