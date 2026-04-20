import pytest
import aiohttp
from unittest.mock import AsyncMock, patch
from draft import get_draft_status


@pytest.mark.asyncio
async def test_get_draft_status_return_pre():
    mock_response = {"type": {"state": "pre"}}

    with patch("draft.aiohttp.ClientSession") as MockSession:
        mock_session = AsyncMock()
        MockSession.return_value.__aenter__.return_value = mock_session

        mock_response_obj = AsyncMock()
        mock_response_obj_json = AsyncMock(return_value=mock_response)
        mock_session.get.return_value.__aenter__.return_value = mock_response_obj

        result = await get_draft_status()
        assert result == "pre"
