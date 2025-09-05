from fastapi import APIRouter, HTTPException
from app.api.schemas.animations import NewtonAnimRequest, NewtonAnimResponse
from app.services.animations.newton_anim import render_newton_video

router = APIRouter(prefix="/animate", tags=["animations"])

@router.post("/newton", response_model=NewtonAnimResponse)
def animate_newton(payload: NewtonAnimRequest):
    try:
        result = render_newton_video(
            function=payload.function,
            x0=payload.x0,
            x_range=payload.x_range,
            y_range=payload.y_range,
            max_iter=payload.max_iter,
            tol=payload.tol,
            fps=payload.fps,
            quality=payload.quality,
            media_dir="app/media",
        )
        url = f"/media/{result['rel_dir']}/{result['filename']}"
        return {"video_url": url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
